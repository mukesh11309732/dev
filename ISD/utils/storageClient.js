const uuid = require('uuid');

/** 
leads = [
    {
        _id: "410ec58a-a0f2-4ac4-8393-c866d813b8d2",
        email: "xyz@gmail.com",
        phone: "9999999999",
        first_name: "Adam",
        last_name: "Muller",
        created_at: "Wed Mar 02 2022 23:07:40 GMT+0100 (Central European Standard Time)"
        updated_at: "Wed Mar 02 2022 23:07:40 GMT+0100 (Central European Standard Time)",
        _internalEmailPhone: "" (unique_constraint)
    }
]

interests = [
    {
        _id: "110ec58a-a0f2-4ac4-8393-c866d813b8d1",
        lead_id: "410ec58a-a0f2-4ac4-8393-c866d813b8d2"
        message: "interested in 3 bedroom",
        created_at: "Wed Mar 02 2022 23:07:40 GMT+0100 (Central European Standard Time)"
        updated_at: "Wed Mar 02 2022 23:07:40 GMT+0100 (Central European Standard Time)"
    }
]
*/

const db = {
    leads: [],
    interests: []
}

module.exports = {
    get: function(model, _id) {
        if(db[model]) {
            let rec = Array.find(db[model], function (rec) {
                return rec._id === _id
            })
            return rec ? rec : new Error(`record with ${_id} does not exist`)
        } else {
            return new Error(`${model} does not exist`)
        }
    },

    create: function(model, record) {
        if(db[model]) {
            record = record || {}
            record._id = uuid.v1()
            if(model == this.getModels().LEADS)
            record._internalEmailPhone = record.email + record.phone
            
            let rec = db[model].find(rec => rec._internalEmailPhone === record._internalEmailPhone);
            if(!rec) {
                db[model].push(record)
                return record._id
            }
            else return new Error('voilates unique contraint email and phone')
        } else {
            return new Error(`${model} does not exist`)
        }
    },
    update: function(model, record) {
        if(db[model]) {
            let rec = _.find(db[model], function (rec) {
                return rec._id === record._id
            }) 
            if(!rec) {
                return new Error(`record with ${_id} does not exist`)
            }
            _.each(record, function (value, key) {
                rec[key] = value
            })
        } else {
            return new Error(`${model} does not exist`)
        }
    },
    delete: function(model, _id) {
        if(db[model]) {
            let newModel = _.filter(db[model], function (rec) {
                return rec._id != _id
            })
            db[model] = newModel
        } else {
            return new Error(`${model} does not exist`)
        }
    },

    getAllByNewestFirst: function(model) {
        if(db[model]) {
            return db[model].sort(function(a, b){
                return new Date(b.created_at) - new Date(a.created_at);
              });
        } else {
            return new Error(`${model} does not exist`)
        }
    },

    getModels: function () {
        return {
            LEADS: "leads",
            INTERESTS: "interests"
        }
    }
}