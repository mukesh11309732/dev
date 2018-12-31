var token = "User lhta4MGWRad9E/0+v7/4hiWY5DpQ8KEDY9AM7jJYCe0=, Organization 1dd7ea75d8f48cbc836ced98701bcc51, Element ffqDK+nl9d5FPvPVdArYYT1/u3y0p8OPd3a8o8tmE9g=";
var headers  = {};
headers["Authorization"] = token;

var rest = require('../utils/restClient');

module.exports = {

	getFileById : function(req, res) {
	    if(!req.headers.id) {
            res.send(rest.getErrorObj("id is missing in request headers"));
            return;
        }
        var options = {};
        options.headers = headers;
        var url = "https://staging.cloud-elements.com/elements/api-v2/files/";
        url += req.headers.id;

		rest.getBinary(url, options, function (response) {
			res.send(response);

        }, function (error) {
            res.send(rest.getErrorObj(error.message));

        });
	},

    getFileByPath : function(req, res) {
        if(!req.headers.path) {
            res.send(rest.getErrorObj("path is missing in request headers"));
            return;
        }
        var options = {};
        options.headers = headers;
        var url = "https://staging.cloud-elements.com/elements/api-v2/files";
        url += "?path=" + encodeURIComponent(req.headers.path);

        rest.getBinary(url, options, function (response) {
            res.send(response);

        }, function (error) {
            res.send(rest.getErrorObj(error.message));

        });
    },

    getFolderContentsById : function(req, res) {
        if(!req.headers.id) {
            res.send(rest.getErrorObj("id is missing in request headers"));
            return;
        }
        var options = {};
        options.headers = headers;
        var url = "https://staging.cloud-elements.com/elements/api-v2/folders/";
        url += req.headers.id;
        url += "/contents";

        rest.get(url, options, function (response) {
            res.send(response);

        }, function (error) {
            res.send(rest.getErrorObj(error.message));

        });
    },

	getFolderContentsByPath : function(req, res) {
        if(!req.headers.path) {
            res.send(rest.getErrorObj("path is missing in request headers"));
            return;
        }
        var options = {};
        options.headers = headers;
        var url = "https://staging.cloud-elements.com/elements/api-v2/folders/contents";
        url += "?path=" + encodeURIComponent(req.headers.path);

        rest.get(url, options, function (response) {
            res.send(response);

        }, function (error) {
            res.send(rest.getErrorObj(error.message));

        });
    },

    uploadFile : function (req, res, next) {
	    if(!req.query.path) {
            res.send(rest.getErrorObj("path is missing in query params"));
            return;
        }
	    var url = "https://staging.cloud-elements.com/elements/api-v2/files";
        url += "?path=" + encodeURIComponent(req.query.path);
        url += "&overwrite=true";

        var options = {};
        options.headers = headers;

	    var Busboy = require('busboy');
	    var busboy = new Busboy({ headers: req.headers });
	    var fileAvailable = false;

        busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {

            fileAvailable = true;
            options.filename = filename;
            options.imageType = mimetype;
            file.on('data', function (data) {

                options.data = data;
                rest.postMultipartContent(url, options, function (response) {
                    try {
                        res.send(response);
                    } catch (e) {
                        console.log("something went wrong"+ e.message);
                    }



                }, function (error) {
                    try {
                        res.send(rest.getErrorObj(error.message));
                    } catch (e) {
                        console.log("something went wrong"+ e.message);
                    }

                });
            });

            file.on('end', function (stream) {
                //No action required
            });
        });

        busboy.on('field', function (fieldname, val) {
            //No action required

        });

        busboy.on('finish', function () {
            //No action required
            if(!fileAvailable) {
               res.send(rest.getErrorObj("Invalid request: Please provide file to upload"));
            }

        });

        // Pipe the HTTP Request into Busboy.
        req.pipe(busboy);
    }
}
