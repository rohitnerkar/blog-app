const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config/keys");

const isAuth = async(req, res, next) => {
    try {
        const authorization = req.headers.authorization && req.headers.authorization.split(" ");
        const token = authorization.length > 1 ? authorization[1] : null;

        if(token){
            const payload = jwt.verify(token, jwtSecret);

            if (Date.now() >= payload.exp * 1000) {
                res.status(401).json({ message: "Token expired" });
            }

            req.user = {
                _id: payload._id,
                name: payload.name,
                email: payload.email,
                role: payload.role
            };
            next();
        } else {
            return res.status(400).json({ message: "Token is required" });
        }
    } catch (error) {
        return res.status(401).json({ message: "Session expired. Please log in again.", error: error.message });
    }
};

module.exports = isAuth;