const request = require("supertest");
const app = require("../../index");
const dbConnection = require("../database/mongooseDatabase");
const GAME_ID = require("./test_config").GAME_ID;
const SHARE_CODE = require("./test_config").SHARE_CODE;
const HINT1 = require("./test_config").HINT1;
const HINT2 = require("./test_config").HINT2;
const HINT_SECRET1 = require("./test_config").HINT_SECRET1;
const HINT_SECRET2 = require("./test_config").HINT_SECRET2;

let userId;
let userToken;

describe('Login step for security endpoint test', () => {
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


describe('getUserInfo security testing', () => {
    it('should fail because of the null token authorization', async () => {
        const res = await request(app)
            .get('/user/' + userId)
            .set({ Authorization: null})

        expect(res.statusCode).toEqual(400);
    })
});


describe('Join game security test', () => {
    it('should fail due to null authorization token', async () => {
        const res = await request(app)
            .put('/join-game/' + SHARE_CODE)
            .send({userId: userId})
            .set({ Authorization: null});

        expect(res.statusCode).toEqual(400);
    })
});


describe('Submit QR security test', () => {
    it('should fail on submiting QR due to null authorization token', async () => {
        const res = await request(app)
            .post('/submit-QR')
            .send({
                "gameId": GAME_ID,
                "userId": userId,
                "hint": HINT1,
                "hintSecret": "wrong secret"
            })
            .set({ Authorization: null});

        expect(res.statusCode).toEqual(400);
    })
});


describe('Kick player security test', () => {
    it('should fail due to null authorization ', async () => {
        const res = await request(app)
            .post('/kick-player')
            .send({
                username: "burak",
                gameId: GAME_ID
            })
            .set({ Authorization: null});

        expect(res.statusCode).toEqual(400);
    })
});

describe('read game endpoint test', () => {
    it('should fail on fetching game data due to authotization', async () => {
        const res = await request(app)
            .get('/game/' +  GAME_ID)
            .set({ Authorization: null})

        expect(res.statusCode).toEqual(400);
    })
});

afterAll(async done => {
    // Closing the DB connection allows Jest to exit successfully.
    dbConnection.connection.close();
    app.close();
    done();
});
