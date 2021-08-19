const Datastore = require('nedb');
const db = new Datastore({ filename: require('path').join(__dirname, '../data/members') });
db.loadDatabase();

module.exports = class Member {
    constructor(obj) {
        for (let key in obj) {
            this[key] = obj[key]
        }
    }

    save() {
        return new Promise((resolve, reject) => {
            db.insert(this, err => {
                if (err) reject(new Error(err))
                resolve()
            })
        })
    }

    // TODO - Цикл промиссов для каждой записи?
    // static update(obj) {
    //     return new Promise((resolve, reject) => {
    //         db.update({ id: obj.oldid }, { $set: { id: obj.id } }, {}, (err, numReplaced) => {
    //             if (err) reject(new Error(err))
    //             resolve(numReplaced)
    //         });
    //     })
    // }

    static delete(obj) {
        return new Promise((resolve, reject) => {
            db.remove(obj, {}, (err, numRemoved) => {
                if (err) reject(new Error(err))
                resolve(numRemoved)
            });
        })
    }

    static find(obj = {}) {
        return new Promise((resolve, reject) => {
            db.find(obj).sort({ id: -1 }).exec((err, result) => {
                if (err) reject(new Error(err))
                resolve(result)
            })
        })
    }

}