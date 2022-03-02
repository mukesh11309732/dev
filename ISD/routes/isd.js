var db = require('../utils/storageClient');

module.exports = {

    listAllLeads: function(req, res) {
        try {
            res.send(db.getAllByNewestFirst(db.getModels().LEADS))
        } catch (e) {
            res.send(e)
        }
    },
    listAllInterests: function(req, res) {
        try {
            res.send(db.getAllByNewestFirst(db.getModels().INTERESTS))
        } catch (e) {
            res.send(e)
        }
    },

    createLead : function(req, res) {
        const body = req.body
        try {
            let interest = {
                message: body.message
            }
            delete body.message
            let lead_id = db.create(db.getModels().LEADS, body)
            interest.lead_id = lead_id
            db.create(db.getModels().INTERESTS, interest)
            res.send("lead successfully added")
        } catch (e) {
            res.send(e)
        }
	}
}
