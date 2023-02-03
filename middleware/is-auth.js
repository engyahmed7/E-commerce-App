const jwt = require('jsonwebtoken');
const User = require('../models/user');
const {
    ReasonPhrases,
    StatusCodes,
    getReasonPhrase,
    getStatusCode,
} = require('http-status-codes');

const access = {
    Admin: "admin",
    User: "user"
}

const auth = () => {
    return (req, res, next) => {
        // console.log(req.headers);
        const authorization = req.headers.authorization;
        // console.log(authorization);
        if (!authorization || authorization == null || authorization == undefined || !authorization.startsWith('Bearer ')) {
            res.status(StatusCodes.UNAUTHORIZED).json({
                message: "you are not authorized",
                ExtraInfo: ReasonPhrases.UNAUTHORIZED
            })
        } else {
            const decodedToken = req.headers.authorization.split(' ')[1];
            jwt.verify(decodedToken, process.env.JWT_SECRET, async function (err, decoded) {
                if (decoded) {
                    let userData = await User.findById(decoded.id);
                    // console.log(userData)
                    if (userData) {
                        if (userData.isAdmin || !userData.isDeleted) {
                            req.user = userData;
                            next()
                        } else {
                            res.status(StatusCodes.UNAUTHORIZED).json({
                                message: "you are not authorized",
                                ExtraInfo: ReasonPhrases.UNAUTHORIZED
                            })
                        }

                    } else {
                        res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
                            message: "User Not Exist",
                            ExtraInfo: ReasonPhrases.UNPROCESSABLE_ENTITY
                        })
                    }
                } else {
                    res.json({
                        message: "invalid token"
                    })
                }
            })
        }
    }
}


//for admin
const admin = () => {
    return (req, res, next) => {
        const authorization = req.headers.authorization;
        if (!authorization || authorization == null || authorization == undefined || !authorization.startsWith('Bearer ')) {
            res.status(StatusCodes.UNAUTHORIZED).json({
                message: "you are not authorized",
                ExtraInfo: ReasonPhrases.UNAUTHORIZED
            })
        } else {
            const decodedToken = req.headers.authorization.split(' ')[1];
            jwt.verify(decodedToken, process.env.JWT_SECRET, async function (err, decoded) {
                if (decoded) {
                    let userData = await User.findById(decoded.id);
                    // console.log(userData)
                    if (userData) {
                        if (userData.isAdmin) {
                            req.user = userData;
                            next()
                        } else {
                            res.status(StatusCodes.UNAUTHORIZED).json({
                                message: "you are not authorized",
                                ExtraInfo: ReasonPhrases.UNAUTHORIZED
                            })
                        }

                    } else {
                        res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
                            message: "User Not Exist",
                            ExtraInfo: ReasonPhrases.UNPROCESSABLE_ENTITY
                        })
                    }
                } else {
                    res.json({
                        message: "invalid token"
                    })
                }
            })
        }
    }
}


module.exports = {
    auth,
    admin,
    access
};