const userModel = require("./.././models/user");

function auth(ctx, next) {
    return new Promise((resolve, reject) => {
        userModel.passport.authenticate('local', (result, error) => {

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
        const result = await auth(ctx, next);

        if (result) {
            ctx.result = result;
            await next();
        } else {
            ctx.body = "Wrong password or username";
            ctx.status = 400;
            console.log("Auth Error");
        }
    } catch (err) {
        console.log("jwtLocal", err);
        ctx.body = err;
        ctx.status = 400;
    }
};
