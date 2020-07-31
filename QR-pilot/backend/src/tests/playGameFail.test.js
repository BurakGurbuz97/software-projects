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

describe('Login step for getLocation endpoint test', () => {
    it('should login with username: burak, password: burak', async () => {
        const res = await request(app)
            .post('/login')
            .send({
                username: "burak",
                password: "burak",
            })
        console.log(res.body);
        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toEqual('Welcome burak');
        userId = res.body.id;
        userToken = res.body.data.token
    })
});

describe('Join game endpoint test', () => {
    it('should fail on joining the game with the given share code', async () => {
        const res = await request(app)
            .put('/join-game/' + "none existing game" )
            .send({userId: userId})
            .set({ Authorization: userToken});

        expect(res.statusCode).toEqual(400);
        expect(res.body.success).toBe(false);
    })
});


describe('Join game endpoint test', () => {
    it('should join the game with the given share code', async () => {
        const res = await request(app)
            .put('/join-game/' + SHARE_CODE )
            .send({userId: userId})
            .set({ Authorization: userToken});

        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toEqual('Game successfully found.');
    })
});


describe('Submit QR endpoint test', () => {
    it('should fail on submiting first QR of the given game', async () => {
        const res = await request(app)
            .post('/submit-QR')
            .send({
                "gameId": GAME_ID,
                "userId": userId,
                "hint": HINT1,
                "hintSecret": "wrong secret"
            })
            .set({ Authorization: userToken});

        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toEqual('Hint secret can not be found')
    })
});


afterAll(async done => {
    // Closing the DB connection allows Jest to exit successfully.
    dbConnection.connection.close();
    app.close();
    done();
});
