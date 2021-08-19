const Member = require('../models/member')
const Horse = require('../models/horse')

exports.form = (req, res) => {
    res.render('member-form', {
        action: '/member',
        title: 'New member',
        member: {}
    })
}

exports.save = (req, res, next) => {
    const member = new Member({
        id: req.body.member.id.toLowerCase().trim(),
        name: req.body.member.name.toLowerCase().trim(),
        birthday: req.body.member.birthday,
        address: req.body.member.address.toLowerCase().trim(),
        pСode: req.body.member.pСode.trim(),
        mail: req.body.member.mail,
        phone: req.body.member.phone.trim(),
        psht: (req.body.member.psht) ? req.body.member.psht : false,
        addedAt: new Date()
    })

    Member.find({ $or: [{ id: member.id }, { name: member.name }] }).then(result => {
        if (result.length === 0) {
            member.save().then(() => {
                res.render('comps/info', {
                    title: 'Success',
                    classes: 'alert-success',
                    text: 'Member was added successfully.'
                })
            }).catch(err => next(err))
        } else {
            res.render('comps/info', {
                title: 'Error',
                classes: 'alert-danger',
                text: 'Member with this name or id already exists.'
            })
        }
    })
}

exports.show = (req, res, next) => {
    const id = req.params.id.toLowerCase()
    Promise.all([
        Member.find({ id: id }),
        Horse.find({ id: id })
    ]).then((data) => {
        const member = data[0][0]
        if (!member) {
            res.render('comps/info', {
                title: 'Error',
                classes: 'alert-danger',
                text: `Member with id: ${req.params.id} does not exist in the database.`
            })
        } else {
            res.render('member-show', {
                title: member.name,
                member,
                horses: data[1]
            })
        }
    }).catch(err => next(err))
}

exports.list = (req, res, next) => {
    Member.find().then((members) => {
        res.render('members-list', {
            title: 'Members',
            members: members
        })
    }).catch(err => next(err));
}

exports.formEdit = (req, res, next) => {
    const id = req.params.id.toLowerCase()
    Member.find({
        id: id
    }).then((member) => {
        if (member.length === 0) {
            res.render('comps/info', {
                title: 'Error',
                classes: 'alert-danger',
                text: `Member with id: ${req.params.id} does not exist in the database.`
            })
        } else {
            console.log(member)
            res.render('member-form', {
                action: '/member/edit',
                title: `Edit member - ${member[0].name}`,
                member: member[0]
            })
        }
    }).catch(err => next(err))
}

exports.update = (req, res, next) => {
    const id = req.body.member.old_id.toLowerCase()
    Member.delete({
        id
    }).then((n) => {
        const member = new Member({
            id: req.body.member.id.toLowerCase().trim(),
            name: req.body.member.name.toLowerCase().trim(),
            birthday: req.body.member.birthday,
            address: req.body.member.address.toLowerCase().trim(),
            pСode: req.body.member.pСode.trim(),
            mail: req.body.member.mail,
            phone: req.body.member.phone.trim(),
            psht: (req.body.member.psht) ? req.body.member.psht : false,
            addedAt: new Date()
        })

        member.save()
            .then(() => {
                res.render('comps/info', {
                    title: 'Success',
                    classes: 'alert-success',

                    text: 'Member was updated successfully.'
                })
            })
    }).catch(err => next(err))
}

exports.delete = (req, res, next) => {
    const id = req.params.id.toLowerCase()
    Member.delete({
        id
    }).then((n) => {
        if (n) {
            res.render('comps/info', {
                title: 'Success',
                classes: 'alert-success',
                text: 'Member was deleted successfully.'
            })
        } else {
            res.render('comps/info', {
                title: 'Error',
                classes: 'alert-danger',
                text: `Member with id: ${req.params.id.toLowerCase()} does not exist in the database.`
            })
        }
    }).catch(err => next(err))
}