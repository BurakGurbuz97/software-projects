const request = require("supertest");
const app = require("../../index");
const dbConnection = require("../database/mongooseDatabase");
const SHARE_CODE= require("./test_config").SHARE_CODE


let userId;
let userToken;

describe('Login step for joinGame endpoint test', () => {
    it('should login with username: burak, password: burak', async () => {
        const res = await request(app)
            .post('/login')
            .send({
                username: "burak",
                password: "burak",
            })
        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toEqual('Welcome burak');
        userId = res.body.id;
        userToken = res.body.data.token
    })
});



describe('JoinGame endpoint test', () => {
    it('should join game with a share code HSNZg ', async () => {
        const res = await request(app)
            .put('/login/' + SHARE_CODE)
            .send({
                "userId": userId 
            }).set({ Authorization: userToken})

        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toEqual('Game successfully found.');
    })
});


afterAll(async done => {
    // Closing the DB connection allows Jest to exit successfully.
    dbConnection.connection.close();
    app.close();
    done();
});


