const request = require("supertest");
const app = require("../../index");
const dbConnection = require("../database/mongooseDatabase");

let userId;

describe('Login endpoint test', () => {
    it('should login with username: yakup, password: yakup', async () => {
        const res = await request(app)
            .post('/login')
            .send({
                username: "yakup",
                password: "yakup",
            })
        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toEqual('Welcome yakup@yakup.com');
        userId = res.body.id;
    })
});

describe('Login endpoint fail case', () => {
    it('should not login with username: empty, password: empty', async () => {
        const res = await request(app)
            .post('/login')
            .send({
                username: "",
                password: "",
            })
        expect(res.statusCode).toEqual(400);
        expect(res.body.message).toEqual("Missing credentials");
    })
});

afterAll(async done => {
    // Closing the DB connection allows Jest to exit successfully.
    dbConnection.connection.close();
    app.close();
    done();
});
