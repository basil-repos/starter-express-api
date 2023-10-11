import jwt from 'jsonwebtoken'
import { createError } from './error.js';

export const verifyToken = (req, res, next) => {
    const token = req.headers.token;
    if(!token) return next(createError(401, "invalid_token"));

    jwt.verify(token, process.env.JWT, (err, user) => {
        if(err) return next(createError(403, "Invalid Token"));
        req.user = user;
        next();
    })
}