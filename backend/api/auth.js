const { authSecret } = require('../.env')
const jwt = require('jwt-simple')
const bcrypt = require('bcrypt-nodejs')

module.exports = app => {
    const signin = async (req, res) => {
        if(!req.body.email || !req.body.password) {
            return res.status(400).send('Informe usuário e senha!')
        }

        const user = await app.db('users')
            .where({ email: req.body.email })
            .first()

        if(!users) return res.status(400).send('Usuários não encontrados!')

        const isMatch = bcrypt.compareSync(req.body.password, user.password)
        if(!isMatch) return res.status(401).send('E-mail/Senha inválidos!')

        const now = Math.floor(Date.now() / 1000)

        const playload = {
            id: user.id,
            name: user.name,
            email: user.email,
            admin: user.admin,
            iat: now,
            exp: now + (60 * 60 *21 * 3)
        }

        res.json({
            ...playload,
            token: jwt.encode(playload, authSecret)
        })
    }

    const validateToken = async (req, res) => {
        const userData = req.body || null
        try {
            if(userData) {
                const token = jwt.decode(userData.token, authSecret)
                if(new Date(token.exp * 100) > new Date()) {
                    return res.send()
                }
            }
        } catch(e) {

        }

        res.send(false)
    }

    return { signin, validateToken }
}