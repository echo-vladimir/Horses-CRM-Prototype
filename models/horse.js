const Datastore = require('nedb');
const db = new Datastore({ filename: require('path').join(__dirname, '../data/horses') });

db.loadDatabase();

module.exports = class Horse {
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
            db.find(obj).sort({ name: 1 }).exec((err, result) => {
                if (err) reject(new Error(err))
                resolve(result)
            })
        })
    }

}