const express = require('express');
const Link = require('../models/link');
const auth = require('../middleware/authentication');

const router = new express.Router();

router.post('/links', auth, async(req, res) => {

    const link = new Link({
        ...req.body,
        owner: req.user._id
    })

    try {
        link.save();
        res.status(201).send(link);
    } catch (e) {
        res.status(400).send(e);
    }
});

router.get('/links', auth, async(req, res) => {

    const match = {}
    const sort = {}

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] == 'desc' ? -1 : 1
    }

    try {

        await req.user.populate({
            path: 'links',
            match: match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort: sort
            }
        }).execPopulate();
        res.send(req.user.links);
    } catch (e) {
        res.status(400).send();
    }

})

router.get('/links/:id', auth, async(req, res) => {
    const _id = req.params.id;

    try {
        // const link = await Link.findOne({ _id, owner: req.user._id });
        const link = await Link.findOne({ _id, owner: req.user._id });

        if (!link) {
            return res.status(404).send();
        }

        res.send(link);
    } catch (e) {
        res.status(500).send();
    }

})

router.patch('/links/:id', auth, async(req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdateProperties = ['title', 'urls'];
    const isValidProperty = updates.every((update) => allowedUpdateProperties.includes(update));

    if (!isValidProperty) {
        return res.status(400).send({ error: 'Inavlid Updates' })
    }

    try {
        const link = await Link.findOne({ _id: req.params.id, owner: req.user._id });

        if (!link) {
            return res.status(404).send();
        }
        updates.forEach((update) => link[update] = req.body[update])
        await link.save();

        res.send(link);
    } catch (e) {
        res.status(400).send(e);
    }
})

router.delete('/links/:id', auth, async(req, res) => {
    const _id = req.params.id;

    try {
        const link = await Link.findOneAndDelete({ _id, owner: req.user._id });

        if (!link) {
            return res.status(404).send();
        }
        res.send(link);
    } catch (e) {
        res.status(500).send();
    }
})
module.exports = router;