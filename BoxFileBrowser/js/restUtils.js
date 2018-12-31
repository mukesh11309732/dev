var downloadFileByPath = function(path, networkCallback) {
    const httpRequest = new XMLHttpRequest();
    const url = 'http://localhost:2000/getFileByPath';
    httpRequest.open("GET", url);
    httpRequest.setRequestHeader("path", path);
    httpRequest.responseType = "blob";
    httpRequest.send();
    httpRequest.onreadystatechange=(httpResponse)=>{
        if(httpResponse.currentTarget.readyState == 4) {
            var result = httpResponse.currentTarget.response;
            verifyAndInvokeCallback(networkCallback, result);
        }
    }
}

var getFolderContentsByPath = function(path, networkCallback) {
    const httpRequest = new XMLHttpRequest();
    const url = 'http://localhost:2000/getFolderContentsByPath';
    httpRequest.open("GET", url);
    httpRequest.setRequestHeader("path", path);
    httpRequest.send();
    httpRequest.onreadystatechange=(httpResponse)=>{
        if(httpResponse.currentTarget.readyState == 4) {
            var result = httpResponse.currentTarget.response;
            result = JSON.parse(result);
            verifyAndInvokeCallback(networkCallback, result);
        }
    }
}

var verifyAndInvokeCallback = function(callback, parameters) {
    if (typeof(callback) === 'function') {
        callback(parameters);
    } else {
        console.log("Invalid callback provided");
    }
}