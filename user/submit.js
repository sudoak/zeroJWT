const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const uuidv1 = require('uuid/v1');
const bcrypt = require('bcrypt');

const adapter = new FileSync('users.json');
const db = low(adapter);
const saltRounds = 1;
const salt = bcrypt.genSaltSync(saltRounds);

// Set some defaults (required if your JSON file is empty)
db.defaults({ users: [], count: 0 }).write();

module.exports = function(req, res) {
    const { password } = req.body;
    const id = uuidv1();
    const hash = bcrypt.hashSync(password, salt);
    
    req.body.password = hash;

    db.get('users')
    .push({ ...req.body, id}).write()
    
    const users = db.get('users')
    .value()
    
    res.send({ users });
};
