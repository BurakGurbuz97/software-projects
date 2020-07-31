const userController = require("../controller/user-controller");
const gameController = require("../controller/game-controller");
const statisticsController = require("../controller/statistics-controller");
const jwtAuth = require("./.././middleware/jwtAuth");
const jwtLocal = require("./.././middleware/jwtLocal");

module.exports = ({router}) => {
    router
        .post('/signUp', userController.signUp)
        .post('/login', jwtLocal, userController.login)
        .put('/changePassword', userController.changePassword)

        .get('/user/:_id', jwtAuth, userController.getUserInfo)
        .put('/user/:_id', jwtAuth, userController.updateUserInfo)
        .post('/kick-player', jwtAuth, userController.kickPlayer)

        .post('/game', jwtAuth, gameController.createGame)
        .put('/join-game/:shareCode', jwtAuth, gameController.joinGame)
        .get('/game/:_id', jwtAuth, gameController.readGame)
        .delete('/game/:_id', jwtAuth, gameController.deleteGame)
        .put('/game/:_id', jwtAuth, gameController.updateGame)
        .post('/start-game', jwtAuth, gameController.startGame)

        .get('/get-locations/:_id', jwtAuth, gameController.getLocations)
        .put('/update-location/:_id', jwtAuth, userController.updateLocation)

        .post('/submit-QR', jwtAuth, gameController.submitQR)
};
