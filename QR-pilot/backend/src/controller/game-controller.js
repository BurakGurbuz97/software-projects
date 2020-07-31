const gameModel = require("../models/game");
const userModel = require("../models/user");
const randomize = require('randomatic');
const _ = require('underscore');

module.exports = {
    createGame: async ctx => {
        try {
            const shareCode = randomize('Aa0', 5);

            const admin = await userModel.User.findOne({_id: ctx.request.body.adminId});

            let gameData = ctx.request.body;
            gameData.shareCode = shareCode;

            let ranking = {};
            ranking.scores = 0;
            ranking.names = admin.username;

            gameData.ranking = ranking;

            const result = await gameModel.create(gameData);

            for (let i = 0; i < gameData.players.length; i++){
                const player = await userModel.User.findOneAndUpdate({
                    _id: gameData.players[i]
                }, {$push: {gameIds: result._id}})
            }

            if (!result) {
                ctx.body = {
                    message: "Game can not be created.",
                    success: false
                };
                ctx.status = 400;
            } else {
                ctx.body = {
                    message: "Game successfully created.",
                    success: true,
                    data: result
                };
                ctx.status = 200;
            }
        }
        catch (err) {
            console.log(err);
            ctx.status = 400;
            ctx.body = {
                message: err,
                success: false
            };
        }
    },
    joinGame: async ctx => {
        try {
            const user = await userModel.User.findOne({_id: ctx.request.body.userId});

            let newRankings = {};
            newRankings.names = user.username;
            newRankings.scores = "0";

            const result = await gameModel.findOneAndUpdate({shareCode: ctx.params.shareCode},
                {$push: {ranking: newRankings, players: ctx.request.body.userId}},
                {new: true});

            const user2 = await userModel.User.findOneAndUpdate({_id: ctx.request.body.userId},
                {$push: {gameIds: result._id}},{
                new: true
                });

            if (!result) {
                ctx.body = {
                    message: "Game can not be found.",
                    success: false
                };
                ctx.status = 400;
            } else {
                ctx.body = {
                    message: "Game successfully found.",
                    data: result,
                    success: true
                };
                ctx.status = 200;
            }
        }
        catch (err){
            console.log(err);
            ctx.status = 400;
            ctx.body = {
                message: err,
                success: false
            };
        }
    },
    readGame: async ctx => {
        try {
            const result = await gameModel.findOne({_id: ctx.params._id});

            let playerNames = [];

            for(let i = 0; i < result.players.length; i++){
                const player =  await userModel.User.findOne({_id: result.players[i]});
                playerNames.push(player.username);
            }

            if (!result) {
                ctx.body = {
                    message: "Game can not be found.",
                    success: false
                };
                ctx.status = 400;
            } else {
                ctx.body = {
                    message: "Game successfully found.",
                    data: result,
                    playerNames: playerNames,
                    success: true
                };
                ctx.status = 200;
            }
        }
        catch (err){
            console.log(err);
            ctx.status = 400;
            ctx.body = {
                message: err,
                success: false
            };
        }
    },
    updateGame: async ctx => {
        try {
            const result = await gameModel.findOne({_id: ctx.params._id});

            if (!result) {
                ctx.body = {
                    message: "Game can not be found.",
                    success: false
                };
                ctx.status = 400;
            } else {
                const result2 = await gameModel.findOneAndUpdate(
                    {_id: ctx.params._id},
                    ctx.request.body,
                    {
                        upsert: true,
                        new: true
                    }
                );

                if (result2) {
                    ctx.body = {
                        message: "Game successfully updated.",
                        data: result,
                        success: true
                    };
                    ctx.status = 200;
                } else {
                    ctx.body = {
                        message: "Game can not be updated.",
                        success: false
                    };
                    ctx.status = 400;
                }
            }
        }
        catch (err) {
            console.log(err);
            ctx.status = 400;
            ctx.body = {
                message: err,
                success: false
            };
        }
    },
    getLocations: async ctx => {
        try{
            const game = await gameModel.findOne({_id: ctx.params._id});

            if(!game){
                ctx.status = 400;
                ctx.body = {
                    message: "game can not be found",
                    success: false
                };
            }
            else{
                let playerArray = game.players;

                let returnData = [];

                for(let i = 0; i < playerArray.length; i++){
                    const user = await userModel.User.findOne({_id: playerArray[i]});

                    returnData.push(user.location);
                }

                ctx.body = {
                    message: "Locations are successfully read.",
                    data: returnData,
                    success: true
                };
                ctx.status = 200;
            }
        }
        catch (err){
            ctx.status = 400;
            ctx.body = {
                message: err.errmsg,
                success: false
            };
        }
    },
    deleteGame: async ctx => {
        try {
            const result = await gameModel.findOneAndRemove({_id: ctx.params._id});

            if (!result) {
                ctx.body = {
                    message: "Game can not be deleted.",
                    success: false
                };
                ctx.status = 400;
            } else {
                ctx.body = {
                    message: "Game successfully deleted.",
                    success: true
                };
                ctx.status = 200;
            }
        }
        catch(err) {
            console.log(err);
            ctx.status = 400;
            ctx.body = {
                message: err,
                success: false
            };
        }
    },
    submitQR: async ctx => {
        try {
            const game = await gameModel.findOne({_id: ctx.request.body.gameId});

            if(!game){
                ctx.status = 200;
                ctx.body = {
                    message: "Game can not be found",
                    success: false
                };
            }
            else {
                let hintIndex = game.hints.hint.indexOf(ctx.request.body.hint);

                if (hintIndex === -1) {
                    ctx.status = 200;
                    ctx.body = {
                        message: "Hint can not be found",
                        success: false
                    };
                }
                else {
                    let hintSecretIndex = game.hints.hintSecret.indexOf(ctx.request.body.hintSecret);

                    if (hintSecretIndex === -1) {
                        ctx.status = 200;
                        ctx.body = {
                            message: "Hint secret can not be found",
                            success: false
                        };
                    }
                    else if (hintIndex === hintSecretIndex) {
                        const user = await userModel.User.findOne({_id: ctx.request.body.userId});
                        const updateGame = await gameModel.findOne({_id: ctx.request.body.gameId});

                        let localRanking = updateGame.ranking;

                        let index = -1;

                        let newScore;

                        let filteredObject = localRanking.find(function(item, i){
                            if(item.names === user.username){
                                index = i;
                                newScore = Number.parseInt(item.scores) + 10;
                                item.scores = newScore;
                                return i;
                            }
                        });

                        let sortedObjs = _.sortBy(localRanking, function(obj){ return parseInt(obj.scores, 10) });

                        const game = await gameModel.findOneAndUpdate({_id: ctx.request.body.gameId},
                            {$set: {ranking: sortedObjs}}, {
                            new: true
                            });

                        if(newScore >= game.hints.hint.length * 10){
                            const game = await gameModel.findOneAndUpdate({_id: ctx.request.body.gameId},
                                {$set: {status: "Ended"}}, {
                                    new: true
                                });

                            ctx.status = 200;
                            ctx.body = {
                                data: game,
                                message: "GAME ENDED! Successfully found hint and hint secret",
                                success: true
                            };
                        }
                        else {
                            ctx.status = 200;
                            ctx.body = {
                                data: game,
                                message: "Successfully found hint and hint secret",
                                success: true
                            };
                        }
                    }
                }
            }
        }
        catch (err){
            console.log(err);
            ctx.status = 400;
            ctx.body = {
                message: "catch",
                success: false
            };
        }
    },
    startGame : async ctx => {
        try{
            const game = await gameModel.findOne({_id: ctx.request.body.gameId});

            if(!game){
                ctx.status = 200;
                ctx.body = {
                    message: "Can not find the game",
                    success: false
                };
            }

            const updateGame = await gameModel.findOneAndUpdate({_id: ctx.request.body.gameId},
                {$set: {deadline: Date.now() + game.gameLength, status: "Being Played"}},
                {new: true});

            if(!updateGame){
                ctx.status = 200;
                ctx.body = {
                    message: "Can not started the game",
                    success: false
                };
            }
            else {
                ctx.status = 200;
                ctx.body = {
                    data: updateGame,
                    message: "Successfully started the game",
                    success: true
                };
            }
        }
        catch(err){
            ctx.status = 400;
            ctx.body = {
                message: "catch",
                success: false
            };
        }
    }
};
