const { validateToken } = require("../services/authentication");


function checkForAuthenticationCookie(cookieName){
    return async (req, res, next) => {
        const tokenCookieValue = req.cookies[cookieName];
        if(!tokenCookieValue){
            return next();
        }
        try{
            const userPayload = await validateToken(tokenCookieValue.token);
            req.user = userPayload;
        }catch(error){
            console.log(error);
        }
        return next();
    };
}

module.exports = {
    checkForAuthenticationCookie,
}