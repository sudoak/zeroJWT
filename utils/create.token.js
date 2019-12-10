const jwt = require('jsonwebtoken');
const secret = 'lol';

const createToken = id => {
    return jwt.sign({ id }, secret, { expiresIn: '2h' });
}

module.exports = createToken;