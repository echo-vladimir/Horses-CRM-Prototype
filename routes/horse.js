const Member = require('../models/member')
const Horse = require('../models/horse')

exports.form = (req, res, next) => {
    Promise.all([
        Member.find(),
        Horse.find()
    ]).then((data) => {
        res.render('horse-form', {
            action: '/horse',
            title: 'New horse',
            members: data[0],
            horses: data[1],
            horse: {},
            member: {}
        })
    }).catch(err => next(err))
}

exports.save = (req, res, next) => {
    const horse = new Horse({
        id: req.body.horse.id.toLowerCase(),
        name: req.body.horse.name.toLowerCase().trim(),
        birthday: req.body.horse.birthday,
        sex: req.body.horse.sex,
        height: req.body.horse.height.toLowerCase().trim(),
        chipnr: req.body.horse.chipnr.toLowerCase().trim(),
        levens: req.body.horse.levens.toLowerCase().trim(),
        pssm: req.body.horse.pssm,
        award: req.body.horse.award,
        father: (req.body.horse.father) ? req.body.horse.father : false,
        mother: (req.body.horse.mother) ? req.body.horse.mother : false,
        imother: (req.body.horse.imother) ? req.body.horse.imother : false,
        ifather: (req.body.horse.ifather) ? req.body.horse.ifather : false,
        addedAt: new Date()
    })

    Horse.find({
        chipnr: req.body.horse.chipnr.toLowerCase().trim()
    }).then(result => {
        if (result.length === 0) {
            horse.save().then(() => {
                res.redirect('/horses')
            }).catch(err => next(err));
        } else {
            res.render('comps/info', {
                title: 'Error',
                classes: 'alert-danger',
                text: 'Horse with this CHIPNR already exists.'
            })
        }
    }).catch(err => next(err))
}

exports.list = (req, res, next) => {
    Horse.find().then((horses) => {
        
        res.render('horses-list', {
            title: 'Horses',
            horses: horses.sort(),
            message: false
        })
    }).catch(err => next(err))
}

exports.formEdit = (req, res, next) => {
    const id = req.params.id,
        chipnr = req.params.chipnr

    Promise.all([
        Member.find(),
        Horse.find(),
        Member.find({ id }),
        Horse.find({ chipnr })
    ]).then((data) => {
        const members = data[0], horses = data[1],
              member = data[2][0], horse = data[3][0]
        if (member && horse) {
            res.render('horse-form', {
                action: '/horse/edit',
                title: horse.name,
                members,
                horses,
                member,
                horse
            })
        } else {
            res.render('comps/info', {
                title: 'Error',
                classes: 'alert-danger',
                text: `Member with ID: ${req.params.id.toUpperCase()} or horse with CHIPNR: ${req.params.chipnr} does not exist in the database`
            })
        }
    }).catch(err => next(err))
}

exports.update = (req, res, next) => {
    const chipnr = req.body.horse.chipnr.toLowerCase()
    Horse.delete({
        chipnr
    }).then((n) => {
        const horse = new Horse({
            id: req.body.horse.id.toLowerCase(),
            name: req.body.horse.name.toLowerCase().trim(),
            birthday: req.body.horse.birthday,
            sex: req.body.horse.sex,
            height: req.body.horse.height.toLowerCase().trim(),
            chipnr: req.body.horse.chipnr.toLowerCase().trim(),
            levens: req.body.horse.levens.toLowerCase().trim(),
            pssm: req.body.horse.pssm,
            award: req.body.horse.award,
            father: (req.body.horse.father) ? req.body.horse.father : false,
            mother: (req.body.horse.mother) ? req.body.horse.mother : false,
            imother: (req.body.horse.imother) ? req.body.horse.imother : false,
            ifather: (req.body.horse.ifather) ? req.body.horse.ifather : false,
            addedAt: new Date()
        })

        horse.save().then(() => {
            res.redirect('/horses')
            // res.cookie('name', 'tobi', { signed: true })
        })
    }).catch(err => next(err))
}

exports.delete = (req, res, next) => {
    const chipnr = req.params.chipnr.toLowerCase()
    Horse.delete({
        chipnr
    }).then((n) => {
        if (n) {
            res.render('comps/info', {
                title: 'Success',
                classes: 'alert-success',
                text: 'Horse was deleted successfully'
            })
        } else {
            res.render('comps/info', {
                title: 'Error',
                classes: 'alert-danger',
                text: `Horse with chipnr: ${req.params.chipnr.toLowerCase()} does not exist in the database`
            })
        }
    }).catch(err => next(err))
}