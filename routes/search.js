const Member = require('../models/member')
const Horse = require('../models/horse')

exports.findForm = (req, res) => {
    res.render('search', {
        title: 'Search'
    })
}

exports.result = (req, res, next) => {
    const { db, psht } = req.body.search,
        request = (req.body.search.request)
            ? req.body.search.request.toLowerCase().trim()
            : undefined

    if (psht) {
        Member.find({ $not: { psht: false } })
            .then((members) => {
                if (members.length === 0) {
                    res.render('search', {
                        title: ':(',
                        classes: 'alert-warning',
                        text: 'Nothing found'
                    })
                } else {
                    res.render('members-list', {
                        title: 'Result of search: Members',
                        members
                    })
                }
            })
            .catch(err => next(err));
    }

    if (db === 'members') {
        Member.find({
            $or: [
                { id: request },
                { name: request },
                { birthday: request },
                { address: request },
                { pСode: request },
                { phone: request },
                { mail: request }
            ]
        })
            .then((members) => {
                if (members.length === 0) {
                    res.render('search', {
                        title: ':(',
                        classes: 'alert-warning',
                        text: 'Nothing found'
                    })
                } else {
                    res.render('members-list', {
                        title: 'Members',
                        members
                    })
                }
            })
            .catch(err => next(err));
    } else if (db === 'horses') {
        Horse.find({
            $or: [
                { id: request },
                { name: request },
                { birthday: request },
                { sex: request },
                { height: request },
                { chipnr: request },
                { pssm: request },
                { award: request },
                { father: request },
                { mother: request }
            ]
        }).then((horses) => {
            if (horses.length === 0) {
                res.render('search', {
                    title: ':(',
                    classes: 'alert-warning',
                    text: 'Nothing found'
                })
            } else {
                res.render('horses-list', {
                    title: 'Result of search: Horses',
                    horses
                })
            }
        }).catch(err => next(err));
    }
}