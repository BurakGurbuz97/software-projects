const request = require("supertest");
const app = require("../../index");
const dbConnection = require("../database/mongooseDatabase");
const GAME_ID = require("./test_config").GAME_ID;

let userId;
let userToken;

describe('Login step for getLocation endpoint test', () => {
    it('should login with username: burak, password: burak', async () => {
        const res = await request(app)
            .post('/login')
            .send({
                username: "burak",
                password: "burak",
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toEqual('Welcome burak');
        userId = res.body.id;
        userToken = res.body.data.token
    })
});

describe('Start game endpoint test fail', () => {
    it('should not be able to change the status of the game to "Being Played"', async () => {
        const res = await request(app)
            .post('/start-game')
            .send({
                gameId: "1"
            })
            .set({ Authorization: userToken});

        expect(res.statusCode).toEqual(400);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toEqual("catch");
    })
});

afterAll(async done => {
    // Closing the DB connection allows Jest to exit successfully.
    dbConnection.connection.close();
    app.close();
    done();
});
