const { USERS } = require('../config/index');
const HttpStatus = require('http-status-codes');
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const bcrypt = require('bcrypt');
const adapter = new FileSync('users.json');

const createToken  = require('../utils/create.token');

const db = low(adapter);


// Set some defaults (required if your JSON file is empty)
db.defaults({ users: [], count: 0 }).write();



module.exports = async (req,res) => {
    try {
        const user = db.get('users')
        .find({ name : req.body.name })
        .value();
        if(user){
            const isAuth = await bcrypt.compare(req.body.password, user.password);

            if(isAuth){
                const token = createToken(user.id)
                return res.status(200).send({ token });
            }
        }

        res.status(HttpStatus.UNAUTHORIZED).send(HttpStatus.getStatusText(HttpStatus.UNAUTHORIZED));
    } catch (error) {
        console.log('====================================');
        console.log(error);
        console.log('====================================');
        res.status(HttpStatus.SERVICE_UNAVAILABLE).send(HttpStatus.getStatusText(HttpStatus.SERVICE_UNAVAILABLE));
    }
    
}