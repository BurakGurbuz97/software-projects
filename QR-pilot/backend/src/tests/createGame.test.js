const request = require("supertest");
const app = require("../../index");
const dbConnection = require("../database/mongooseDatabase");
const gameModel = require("../models/game");

let userId;
let userToken;

describe('Login step for createGame endpoint test', () => {
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
        userToken = res.body.data.token
    });
});

describe('create endpoint test', () => {
    it('should create a game successfully', async () => {
        const res = await request(app)
            .post('/game')
            .send({
                "title": "Test Game",
                "adminId": userId,
                "type": "Standart",
                "location": {
                  "latitude": 41.105399,
                  "longitude": 29.023522,
                  "radius": 1000
                },
                "description":"Testing create game",
                "hints": {
                    "hint": ["Test Hint 1", "Test Hing 2", "Test Hint 3"],
                    "hintSecrets": ["595cdf23-4f84-43bc-9f53-9d79008a356e", "b363e30e-68ba-481e-a92e-05708cb79a3c","5e8f3b04-0c89-4938-8615-f7ade65cfddf"]
                },
                "gameLength": 50,
                "players": [userId],
                "status": "Created"
            }).set({ Authorization: userToken});

        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.type).toEqual("Standart");
        expect(res.body.data.description).toEqual("Testing create game");
        expect(res.body.data.status).toEqual("Created");
        expect(res.body.message).toEqual('Game successfully created.');
    })
});

afterAll(async done => {
    // Closing the DB connection allows Jest to exit successfully.
    const testUser = await gameModel.findOneAndRemove({title: "Test Game"});
    dbConnection.connection.close();
    app.close();
    done();
});
