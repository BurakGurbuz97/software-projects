const statisticsModel = require("../models/statistics");

module.exports = {
    createStatistics: async ctx => {
        try{
            const result = await statisticsModel.create(ctx.request.body);

            if(!result){
                ctx.body = {
                    message: "Statistics can not be created.",
                    success: false
                };
                ctx.status = 400;
            } else {
                ctx.body = {
                    message: "Statistics successfully created.",
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
    getStatistics: async ctx =>{
        try{
            const result = await statisticsModel.findOne({name: ctx.request.body.name})

            if(!result){
                ctx.body = {
                    message: "Statistics with can not be read.",
                    success: false
                };
                ctx.status = 400;
            }
            else {
                ctx.body = {
                    message: "Statistics successfully read.",
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
    editStatistics: async ctx => {
        try{
            const result = await statisticsModel.findOneAndUpdate(
                {name: ctx.request.body.name},
                ctx.request.body
            );

            if(!result){
                ctx.body = {
                    message: "Statistics can not be updated.",
                    success: false
                };
                ctx.status = 400;
            } else {
                ctx.body = {
                    message: "Statistics successfully updated.",
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
    }
};
