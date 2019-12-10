
const jwt = require('jsonwebtoken');
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('users.json');
const db = low(adapter);
const secret = 'lol';

const authorizeToken = (req,res, next,token) => {
    return new Promise((resolve,reject)=> {
        try {
            var decoded = jwt.verify(token, secret);
            const user = db.get('users')
            .find({ id : decoded.id })
            .value();
            if(user) {
                req.user = user;
                resolve();
            }
            throw new Error("User not Authorized")
        } catch(err) {
            reject(err);
        }
    })
}

module.exports = authorizeToken;