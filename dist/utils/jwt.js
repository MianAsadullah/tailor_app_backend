"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.signToken = void 0;
const jwt = require("jsonwebtoken");
const signToken = (payload) => {
    const secret = process.env.JWT_SECRET || 'changeme';
    const expiresIn = process.env.JWT_EXPIRES_IN || '1d';
    return jwt.sign(payload, secret, {
        expiresIn: expiresIn,
    });
};
exports.signToken = signToken;
const verifyToken = (token) => {
    const secret = process.env.JWT_SECRET || 'changeme';
    return jwt.verify(token, secret);
};
exports.verifyToken = verifyToken;
//# sourceMappingURL=jwt.js.map