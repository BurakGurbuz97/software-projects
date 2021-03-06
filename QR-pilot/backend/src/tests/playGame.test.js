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
        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toEqual('Welcome burak');
        userId = res.body.id;
        userToken = res.body.data.token
    })
});

describe('Join game endpoint test', () => {
    it('should join the game with the given share code', async () => {
        const res = await request(app)
            .put('/join-game/' + SHARE_CODE)
            .send({userId: userId})
            .set({ Authorization: userToken});

        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toEqual('Game successfully found.');
    })
});

describe('getLocations endpoint test', () => {
    it('should fetch locations of the players from the game', async () => {
        const res = await request(app)
            .get('/get-locations/' + GAME_ID)
            .set({ Authorization: userToken});

        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toEqual('Locations are successfully read.');
    })
});

describe('updateLocation endpoint test', () => {
    it('should update location of the given user to (0,0)', async () => {
        const res = await request(app)
            .put('/update-location/' + userId)
            .send({
                "location": {
                    "latitude": 0.0,
                    "longitude": 0.0
                }
            })
            .set({ Authorization: userToken});
        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toEqual('User successfully updated.')
    })
});

describe('Submit QR endpoint test', () => {
    it('should submit first QR of the given game', async () => {
        const res = await request(app)
            .post('/submit-QR')
            .send({
                "gameId": GAME_ID,
                "userId": userId,
                "hint": HINT1,
                "hintSecret": HINT_SECRET1
            })
            .set({ Authorization: userToken});

        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toEqual('Successfully found hint and hint secret')
    })
});

describe('Submit QR endpoint test', () => {
    it('should submit last QR of the given game and see that game ends', async () => {
        const res1 = await request(app)
            .post('/submit-QR')
            .send({
                "gameId": GAME_ID,
                "userId": userId,
                "hint": HINT1,
                "hintSecret": HINT_SECRET1
            })
            .set({ Authorization: userToken});

        const res = await request(app)
            .post('/submit-QR')
            .send({
                "gameId": GAME_ID,
                "userId": userId,
                "hint": HINT2,
                "hintSecret": HINT_SECRET2
            })
            .set({ Authorization: userToken});

        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.status).toEqual("Ended");
        expect(res.body.message).toEqual('GAME ENDED! Successfully found hint and hint secret')
    })
});

afterAll(async done => {
    // Closing the DB connection allows Jest to exit successfully.
    dbConnection.connection.close();
    app.close();
    done();
});
