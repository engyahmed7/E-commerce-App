const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendEmail = require('../services/sendMail');

exports.register = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            cpassword,
            age
        } = req.body;

        const userExist = await User.findOne({
            email: email
        })
        if (userExist) {
            return res.status(422).json({
                error: "Email already exist"
            })
        }
        if (password != cpassword) {
            return res.status(422).json({
                error: "Password not matching"
            })
        } else {
            const user = new User({
                name,
                email,
                password,
                age
            })
            await user.save();
            const token = jwt.sign({
                id: user._id,
                isAdmin: user.isAdmin
            }, process.env.JWT_SECRET, {
                expiresIn: "1h"
            })
            const URI = `${req.protocol}://${req.headers.host}/api/auth/confirm/${token}`
            const message = `<h1>Hi ${name}</h1>
            <p>Thank you for registering with us</p>
            <p>Click on the link below to confirm your email</p>
            
            <a href="http://localhost:5000/api/auth/confirm/${token}">Confirm Email</a>
            `
            sendEmail(email, message);
            res.status(201).json({
                message: "User registered successfully",
                user,
            })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: "Internal server error",
            message: error.message
        })
    }
}

exports.confirmEmail = async (req, res) => {
    try {
        const {
            token
        } = req.params;
        console.log(token);
        if (token == undefined || token == null || !token) {
            res.status(404).json({
                message: "you should hava a token"
            })
        } else {
            let decoded = jwt.verify(token, process.env.JWT_SECRET)
            if (decoded) {
                let {
                    id
                } = decoded;
                let foundedUser = await User.findById(id);
                if (foundedUser) {
                    if (foundedUser.isConfirmed) {
                        res.status(400).json({
                            message: "email already confirmed"
                        })
                    } else {
                        let updateUser = await User.findByIdAndUpdate(foundedUser._id, {
                            isConfirmed: true
                        }, {
                            new: true
                        })
                        res.status(200).json({
                            message: "Done! email confirmed, Please Login ",
                            updateUser
                        })
                    }
                } else {
                    res.status(403).json({
                        message: "invalid email"
                    })
                }
            } else {
                res.status(403).json({
                    message: "invalid token"
                })
            }
        }
    } catch (error) {
        res.status(403).json({
            message: "invalid token",
            error
        })
    }
}

exports.ResendToken = async (req, res) => {
    const {
        id
    } = req.params;
    const foundedUser = await User.findById(id);
    if (foundedUser) {
        if (!foundedUser.isConfirmed) {
            const token = jwt.sign({
                id: foundedUser._id
            }, process.env.JWT_SECRET)
            const URI = `${req.protocol}://${req.headers.host}/api/auth/reconfirm/${token}`
            const message = `<h2>Hi ${foundedUser.name}</h2>
            <p>Thank you for registering with us</p>
            <p>Click on the link below to confirm your email</p>
            <a href=${URI}>Re-Confirm Email</a>`
            sendEmail(foundedUser.email, message);
            res.json({
                message: 'please check your email now',
            })
        } else {
            res.status(409).json({
                message: 'Your account is already verified'
            })
        }
    } else {
        res.status(400).json({
            message: 'user not found'
        })
    }

}

exports.reconfirmEmail = async (req, res) => {
    try {
        const {
            token
        } = req.params;
        console.log(token);
        if (token == undefined || token == null || !token) {
            res.status(404).json({
                message: "you should hava a token"
            })
        } else {
            let decoded = jwt.verify(token, process.env.JWT_SECRET)
            if (decoded) {
                let {
                    id
                } = decoded;
                let foundedUser = await User.findById(id);
                if (foundedUser) {
                    if (foundedUser.isConfirmed) {
                        res.status(400).json({
                            message: "email already confirmed"
                        })
                    } else {
                        let updateUser = await User.findByIdAndUpdate(foundedUser._id, {
                            isConfirmed: true
                        }, {
                            new: true
                        })
                        res.status(200).json({
                            message: "Done! email confirmed, Please Login ",
                            updateUser
                        })
                    }
                } else {
                    res.status(403).json({
                        message: "invalid email"
                    })
                }
            } else {
                res.status(403).json({
                    message: "invalid token"
                })
            }
        }
    } catch (error) {
        res.status(403).json({
            message: "invalid token",
            error
        })
    }
}

exports.login = async (req, res) => {
    try {
        const {
            email,
            password
        } = req.body;

        const foundedUser = await User.findOne({
            email: email
        })
        if (foundedUser) {
            const isMatch = bcrypt.compareSync(password, foundedUser.password)
            if (isMatch) {
                const token = jwt.sign({
                    id: foundedUser._id,
                    isLoggin: true,
                    isAdmin: foundedUser.isAdmin
                }, process.env.JWT_SECRET);
                if (!foundedUser.isConfirmed) {
                    res.status(403).json({
                        message: "please confirm your email first !!"
                    })
                } else {
                    res.status(200).json({
                        message: "login successfully",
                        token
                    })
                }
            } else {
                res.status(401).json({
                    message: "invalid password"
                })
            }
        } else {
            res.status(404).json({
                message: "User not found"
            })
        }
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error
        })
    }
}

exports.sendCode = async (req, res) => {
    const {
        email
    } = req.body;

    const foundedUser = await User.findOne({
        email
    })
    if (foundedUser) {
        const code = Math.floor(Math.random() * (9999 - 1000 + 1) + 1000)
        const updateCode = await User.findByIdAndUpdate(foundedUser._id, {
            code
        }, {
            new: true
        })
        const message = ` < h1 > Hi $ {
                        foundedUser.name
                    } < /h1> <
                    p > your code is: $ {
                        code
                    } < /p>
                use this code to reset password
                    `
        sendEmail(email, message);
        res.status(200).json({
            message: "code sent successfully. please check your email",
            updateCode
        })
    } else {
        res.status(404).json({
            message: "email not found"
        })
    }
}

exports.resetPassword = async (req, res) => {
    const {
        code,
        password,
        cpassword
    } = req.body;

    const foundedUser = await User.findOne({
        code
    })
    if (foundedUser) {
        if (password != cpassword) {
            res.status(400).json({
                message: "password not matching"
            })
        } else {
            const hash = bcrypt.hashSync(password, parseInt(process.env.saltRounds));
            await User.findByIdAndUpdate(foundedUser._id, {
                password: hash,
                code: ''
            }, {
                new: true
            })
            res.status(200).json({
                message: "password updated successfully",
            })
        }
    } else {
        res.status(404).json({
            message: "Wrong Code !!!"
        })
    }
}