const bcrypt = require('bcrypt-nodejs')

module.exports = app => {
    const { existOrError, notExistsOrError, equalsOrError } = app.api.validation

    const encryptPassword = password =>{
        const salt = bcrypt.genSaltSync(10)
        return bcrypt.hashSync(password, salt)
    }

    const save = async (req, res) => {
        const user = { ...req.body }
        if(req.params.id) user.id = req.params.id
        
        try {
            existOrError(user.name, 'Nome não informado')
            existOrError(user.email, 'E-mail não informado')
            existOrError(user.password, 'Senha não informada')
            existOrError(user.confirmPassword, 'Confirmação de Senha inválida')
            equalsOrError(user.password, user.confirmPassword, 'Senhas não conferem')

            const userFromDB = await app.db('users')
                .where({ email: user.email }).first()
                if(!user.id) notExistsOrError(userFromDB, 'Usuário já cadastrado.')
        } catch(msg) {
            return res.status(400).send(msg)
        }

        user.password = encryptPassword(user.password)
        delete user.confirmPassword

        if(user.id){
            app.db('user')
                .update(user)
                .where({ id: user.id })
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        } else {
            app.db('users')
                .insert(user)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }
    }

    const get = (req, res) => {
        app.db('users')
            .select('id', 'name', 'email', 'admin')
            .whereNull(deleteAt)
            .then(users => res.json(users))
            .catch(err => res.status(500).send(err))
    }

    const getById = (req, res) => {
        app.db('users')
            .select('id', 'name', 'email', 'admin')
            .where({ id: req.params.id })
            .whereNull('deletedAt')
            .first()
            .then(user => res.json(user))
            .catch(err => res.status(500).send(err))
    }


    const remove = async (req, res) => {
        try {
            const articles = await app.db('articles')
                .where({ userId: req.params.id })
            notExistsOrError(articles, 'Usuários possui artigos.')

            const rowsUpdated = await app.db('users')
                .update({deleteAt: new Date()})
                .where({id: req.params.id})
            existOrError(rowsUpdated, 'Usuário não foi encontrado')

            res.status(204)
        } catch (msg) {
            res.status(400).send(msg)
        }
    }

    return { save, get, getById, remove}
}