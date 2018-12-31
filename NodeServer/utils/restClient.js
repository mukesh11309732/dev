var request = require('request');

module.exports = {
    get: function (url, options, onSuccess, onFailure) {
        request.get(url, options, function (err, res, body) {
            if(err) {
                onFailure(err);

            } else if(res.statusCode == 200){
                onSuccess(body);

            } else if(body && JSON.parse(body).message) {
                onFailure(JSON.parse(body));

            } else {
                var errObj = {"message" : "something went wrong"};
                onFailure(errObj);
            }
        });
    },

    getBinary: function (url, options, onSuccess, onFailure) {
        var requestSettings = {
            method: 'GET',
            url: url,
            encoding: null,
            headers: options.headers
        };
        request.get(requestSettings, function (err, res, body) {
            if(err) {
                onFailure(err);

            } else if(res.statusCode == 200){
                onSuccess(body);

            } else if(body && JSON.parse(body).message) {
                onFailure(JSON.parse(body));

            } else {
                var errObj = {"message" : "something went wrong"};
                onFailure(errObj);
            }
        });
    },

    postMultipartContent : function(url, options, onSuccess, onFailure) {

        var FormData = require('form-data');
        var form = new FormData();

        form.append('file', options.data,
            {contentType: options.imageType, filename: options.filename});

        form.getLength(function(err, length){
            if (err) {
                return onFailure(err);
            }

            var r = request.post(url, reqCallback);
            r._form = form;
            r.setHeader('Authorization', options.headers.Authorization);
            r.setHeader('Content-type', 'multipart/form-data')

        });

        function reqCallback(err, res, body) {
            if(err) {
                onFailure(err);

            } else if(res.statusCode == 200){
                onSuccess(body);

            } else if(body && JSON.parse(body).message) {
                onFailure(JSON.parse(body));

            } else {
                var errObj = {"message" : "something went wrong"};
                onFailure(errObj);
            }
        }
    },

    getErrorObj : function(errMsg) {
        var errObj = {"message" : errMsg};
        return errObj;
    }
}