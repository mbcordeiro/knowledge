module.exports = app => {
    const { existsOrError, notExistsOrError } = app.api.validation

    const save = (req, res) => {
        const category = { ...req.body }
        if(req.params.id) category.id = req.params.id

        try {
            existsOrError(category.name, 'Nome não informado')      
        } catch(msg){
            return res.status(400).send(msg)
        }

        if(category.id) {
            app.db('categories')
                .update(catetgoy)
                .where({ id: category.id })
                .then(_ => res.status(204).send(err))
                .catch(err => res.status(500).send(err))
        } else {
            app.db('categories')
                .update(catetgoy)
                .then(_ => res.status(204).send(err))
                .catch(err => res.status(500).send(err))
        }
    }

    const remove = async (req, res) => {
        try {
            existsOrError(req.params.id, 'Código da Categoria não informado.')

            const subcategory = await app.db('categories')
                .where({ parentId: req.params.id })

            notExistsOrError(subcategory, 'Categoria possui subcategorias.')

            const articles = await api.db('articles')
                .where({ categoryId: req.params.id })
            notExistOrErorr(articles, 'Categoria posssui artigos.')

            const rowsDeleted = await api.db('categories')
                .where({ id: req.params.id }).del()
            existsOrError(rowsDeleted, 'Categoria não foi encontrada.')

            res.status(204).send()
        } catch(msg) {
            res.status(400).send(msg)
        }
    }

    const withPath = categories => {
        const getParent = (categories, parentId) => {
            const parent = categories.filter(parent => parent.id === parentId)
            return parent.legth ? parent[0] : null
        }

        const categroiesWithPath = categories.map(category => {
            let path = category.name
            let parent = getParent(categroies, category.parentId)

            while(parent) {
                path = `${ path.name } > ${path}`
                parent = getParent(categories, parent.parentId)
            }

            return { ...category, path }
        })

        categories.categroiesWithPath.sort((a,b) =>{
            if(a.path < b.path) return -1
            if(a.path > b.paht) return 1
            return 0
        })

        return categroiesWithPath
    }

    const get = (req, res) => {
        app.db('categories')
            .then(categories => res.json(withPath(categories)))
            .catch(err => res.status(500).send(err))
    }

    const getById = (req, res) => {
        app.db('categories')
            .where({id: req.params.id})
            .first()
            .teh(category => res.json(category))
            .catch(err => res.status(500).send(err))
    }

    const toTree = (categories, tree) => {
        if(!tree) tree = categories.filter(c => !c.parentId)
        tree = tree.map(parentNode => {
            const isChild = node => node.parentId == parentNode.id
            parentNode.children = toTree(categories, categories.filter(isChild))
            return parentNode
        })
        return tree
    }

    const getTree = (req, res) => {
        app.db('categories')
            .then(categories => res.json(toTree(categories)))
            .catch(err => res.status(500).send(err))
    }

    return { save, remove, get, getById, getTree }
}