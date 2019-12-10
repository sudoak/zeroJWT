const HttpStatus = require('http-status-codes');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('users.json');
const authorizeToken = require('../utils/authorize.token');
const db = low(adapter);


// Set some defaults (required if your JSON file is empty)
db.defaults({ users: [], count: 0 }).write();

const middleware = async (req, res, next) => {
    try {
        const { authorization } = req.headers;
        if(authorization){
            await authorizeToken(req,res,next,authorization);
            return next()
        }
        throw new Error("Not Authorized");
    } catch (error) {
        res.status(HttpStatus.UNAUTHORIZED).send(HttpStatus.getStatusText(HttpStatus.UNAUTHORIZED));
    }
};


module.exports = async (req,res) => {
    middleware(req,res, () => {
        try {
            delete req.user.password;
            res.send({message:"lol", ...req.user});
        } catch (error) {
            res.status(500).send("Server Down");
        }
    });  
};