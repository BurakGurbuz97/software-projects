const request = require("supertest");
const app = require("../../index");
const dbConnection = require("../database/mongooseDatabase");
const userModel = require("./.././models/user");

describe('Signup endpoint test', () => {
    it('should sign up with username: test1, password: test1, email: test1, secretQuestion: test1, secretAnswer: test1', async () => {
        const res = await request(app)
            .post('/signUp')
            .send({
                username: "test1",
                email: "test1",
                password: "test1",
                secretQuestion: "test1",
                secretAnswer: "test1"
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message.email).toEqual('test1');
        expect(res.body.message.username).toEqual('test1');
        expect(res.body.message.secretAnswer).toEqual('test1');
        expect(res.body.message.secretQuestion).toEqual('test1');
    })
});

describe('SignUp endpoint fail case', () => {
    it('should not sign up with username: test', async () => {
        const res = await request(app)
            .post('/signUp')
            .send({
                username: "",
            });
        expect(res.statusCode).toEqual(400);
        expect(res.body.success).toBe(false);
    })
});

afterAll(async done => {
    // Closing the DB connection allows Jest to exit successfully.
    const testUser = await userModel.User.findOneAndRemove({username: "test1"});

    dbConnection.connection.close();
    app.close();
    done();
});
