const router = require('express').Router()
const Comments = require("./comments-model")
const restricted = require("../auth/restricted-middleware")

// module.exports = {
//     add,
//     find,
//     findById
// }

router.get('/', (req, res) => {
    Comments.find()
        .then(comment => {
            res.status(200).json(comment)
        })
        .catch(err => {
            res.status(400).json({ msg: err })
        })
})

router.get('/:id', (req, res) => {
    Comments.findById(req.params.id)
        .then(comment => {
            res.status(200).json(comment)
        })
        .catch(err => {
            res.status(400).json({ msg: err })
        })
})

router.post('/', restricted, (req, res) => {
    //body, user_id, post_id required
    if (!req.body.body || !req.body.user_id || !req.body.post_id) {
        res.json({ msg: "cuerpo, id de usuario, id de post son requeridos" })
    }
    else {
        Comments.add(req.body)
            .then(comment => {
                res.status(200).json(comment)
            })
            .catch(err => {
                res.status(400).json({ msg: "Error al agregar el comentario" })
            })
    }
})

router.put('/upvote/:id', restricted, (req, res) => {
    Comments.upVote(req.params.id)
        .then(count => {
            if (count > 0)
                res.status(201).json({ msg: "voto subido con exito" })
            else
                res.status(400).json({ msg: "error al subir voto" })
        })
        .catch(err => {
            res.status(500).json({ msg: "error en el servidor" })
        })
})
router.put('/downvote/:id', restricted, (req, res) => {
    console.log("in down")
    Comments.downVote(req.params.id)
        .then(count => {
            if (count > 0)
                res.status(201).json({ msg: "voto quitado con exito" })
            else
                res.status(400).json({ msg: "error al dar de baja el voto" })
        })
        .catch(err => {
            res.status(500).json({ msg: "error en el servidor" })
        })
})

router.delete('/:id', restricted, (req, res) => {
    Comments.trash(req.params.id)
        .then(count => {
            if (count) {
                res.status(200).json({ msg: "Eliminado" })
            }
            else {
                res.status(400).json({ msg: "error al borrar" })
            }
        })
        .catch(err => {
            res.status(400).json({ msg: "error al intentar borrar el mensaje en el servidor" })
        })
})

module.exports = router