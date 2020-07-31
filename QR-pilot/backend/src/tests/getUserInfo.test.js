const request = require("supertest");
const app = require("../../index");
const dbConnection = require("../database/mongooseDatabase");

let userId;
let userToken;

describe('Login step for getUserInfo endpoint test', () => {
    it('should login with username: yakup, password: yakup', async () => {
        const res = await request(app)
            .post('/login')
            .send({
                username: "yakup",
                password: "yakup",
            })
        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBe(true);
        console.log(res.body);
        expect(res.body.message).toEqual('Welcome yakup@yakup.com');
        userId = res.body.id;
        userToken = res.body.data.token
    })
});

describe('getUserInfo endpoint test', () => {
    it('should fetch user information of the user yakup ', async () => {
        const res = await request(app)
            .get('/user/' + userId)
            .set({ Authorization: userToken});

        console.log(res.body);
        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.username).toEqual('yakup');
        expect(res.body.message).toEqual('User info is read.');
    })
});

afterAll(async done => {
    // Closing the DB connection allows Jest to exit successfully.
    dbConnection.connection.close();
    app.close();
    done();
});
