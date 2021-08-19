exports.required = (field) => {
    field = parseField(field)
    return (req, res, next) => {
        if (getField(req, field)) {
            next()
        } else {
            res.render('error', {
                message: `${field.join(' ')} is required`
            })
        }
    }
}

exports.lengthAbove = (field, len) => {
    field = parseField(field)
    return (req, res, next) => {
        if (getField(req, field).length > len) {
            next()
        } else {
            const fields = field.join(' ')
            res.render('error', {
                message: `${fields} должен иметь больше чем ${len} символов`
            })
        }
    }
}

function parseField(field) {
    return field.split(/\[|\]/).filter((s) => s)
}

function getField(req, field) {
    let val = req.body
    field.forEach((prop) => {
        val = val[prop]
    })

    return val
}