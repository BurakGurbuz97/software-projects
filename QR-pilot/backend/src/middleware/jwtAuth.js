const userModel = require("./.././models/user");

function jwt(ctx, next) {
     return new Promise((resolve, reject) => {
       userModel.passport.authenticate('jwt', (result, error) => {
            if(error){
                reject(error);
            }
            if (result) {
                resolve(result);
            } else {
                reject(error);
            }

        })(ctx, next);
    });
}

module.exports = async (ctx, next) => {
    try {
        const jwtAuthResult = await jwt(ctx, next);

        if (jwtAuthResult) {
            ctx.result = jwtAuthResult;
            await next();
        } else {
            ctx.body = "JWT Token Error";
            ctx.status = 400;
        }
    } catch (err) {
        console.log("jwtAuth Error", err);
        ctx.body = "JWT Authentication Error " + err;
        ctx.status = 400;
    }
};
