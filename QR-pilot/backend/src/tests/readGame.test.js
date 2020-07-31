const request = require("supertest");
const app = require("../../index");
const dbConnection = require("../database/mongooseDatabase");
const GAME_ID = require("./test_config").GAME_ID

let userId;
let userToken;


describe('Login step for readGame endpoint test', () => {
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


describe('read game endpoint test', () => {
    it('should fetch data of the game', async () => {
        const res = await request(app)
            .get('/game/' + GAME_ID)
            .set({ Authorization: userToken})

        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toEqual('Game successfully found.');
    })
});


describe('read game endpoint test', () => {
    it('should fail on fetching game data', async () => {
        const res = await request(app)
            .get('/game/' + "11111")
            .set({ Authorization: userToken})

        expect(res.statusCode).toEqual(400);
        expect(res.body.success).toBe(false);
    })
});

afterAll(async done => {
    // Closing the DB connection allows Jest to exit successfully.
    dbConnection.connection.close();
    app.close();
    done();
});





