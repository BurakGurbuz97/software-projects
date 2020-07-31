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

describe('Start game endpoint test', () => {
    it('should change the status of the game to "Being Played"', async () => {
        const res = await request(app)
            .post('/start-game')
            .send({
                gameId: GAME_ID
            })
            .set({ Authorization: userToken});

        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.status).toEqual("Being Played");
        expect(res.body.message).toEqual("Successfully started the game");
    })
});

describe('Kick player endpoint test', () => {
    it('should kick the player with given username', async () => {
        const res = await request(app)
            .post('/kick-player')
            .send({
                username: "burak",
                gameId: GAME_ID
            })
            .set({ Authorization: userToken});

        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toEqual("Successfully kicked player");
    })
});

afterAll(async done => {
    // Closing the DB connection allows Jest to exit successfully.
    dbConnection.connection.close();
    app.close();
    done();
});
