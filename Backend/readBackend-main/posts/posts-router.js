const router = require('express').Router()
const Post = require("./posts-model")
const restricted = require("../auth/restricted-middleware.js")


// module.exports = {
//     add,
//     find,
//     findById
// }

router.get('/', (req, res) => {
    Post.find()
        .then(post => {
            res.status(200).json(post)
        })
        .catch(err => {
            res.status(400).json({ msg: err })
        })
})

router.get('/:id', (req, res) => {
    Post.findById(req.params.id)
        .then(post => {
            res.status(200).json(post)
        })
        .catch(err => {
            res.status(400).json({ msg: err })
        })

})

//find all comments of posts
router.get('/:id/comments', (req, res) => {
    Post.findComments(req.params.id)
        .then(comments => {
            res.status(200).json(comments)
        })
        .catch(err => {
            res.status(400).json({ msg: err })
        })
})

//upvote a post
router.put('/upvote/:id', (req, res) => {
    Post.upVotePost(req.params.id)
        .then(count => {
            if (count) {
                res.status(201).json({ msg: "voto agregado" })
            }
            else {
                res.status(400).json({ msg: "error al votar" })
            }
        })
        .catch(err => {
            res.status(500).json({ msg: "error en el servidor" })
        })
})

//downvote a post
router.put('/downvote/:id', (req, res) => {
    Post.downVotePost(req.params.id)
        .then(count => {
            if (count) {
                res.status(201).json({ msg: "voto eliminado" })
            }
            else {
                res.status(400).json({ msg: "error al eliminar el voto" })
            }
        })
        .catch(err => {
            res.status(500).json({ msg: "error en el servidor" })
        })
})

router.post('/', restricted, (req, res) => {
    //title, body, user_id required, subreadit_id
    if (!req.body.title || !req.body.body || !req.body.user_id || !req.body.subreadit_id) {
        res.json({ msg: "titulo, cuerpo, id de usuario y subreadit requeridos" })
    }
    else {
        Post.add(req.body)
            .then(post => {
                res.status(200).json(post)
            })
            .catch(err => {
                res.status(400).json({ msg: "error al cargar el post en el servidor" })
            })
    }
})

router.delete('/:id', restricted, (req, res) => {
    Post.trash(req.params.id)
        .then(count => {
            if (count) {
                res.status(200).json({ msg: "Eliminado" })
            }
            else {
                res.status(400).json({ msg: "error al borrar" })
            }
        })
        .catch(err => {
            res.status(400).json({ msg: "error en el servidor" })
        })
})

module.exports = router