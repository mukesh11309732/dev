var currentPath = "/";
/*
* one row ui element
*
<a href="#" class="list-group-item list-group-item-action" title="path" onclick="getFolderContents(this)">
    <div class="row">
    <div class="col-md-4"><img src="res/dir.png" class="img-file-thumbnail" />Filename</div>
    <div class="col-md-4">Dec 18, 2018</div>
<div class="col-md-4">63.2 MB</div>
</div>
</a>
* to insert -> title, imageType, fileName, Date, Size
*/
var htmlString = new Array();
htmlString[0] = '<a href="#" class="list-group-item list-group-item-action" id="';
htmlString[1] = '" onclick="getFolderContents(this)"><div class="row"><div class="col-md-4"><img src="res/';
htmlString[2] = '" class="img-file-thumbnail" />';
htmlString[3] = '</div><div class="col-md-4">';
htmlString[4] = '</div><div class="col-md-4">';
htmlString[5] = '</div></div></a>';
var getCurrentPath = function () {
    return currentPath;
}

var setCurrentPath = function (path) {
    currentPath = path;
}

var getFolderContents = function(obj) {
    startLoading();
    var fileMetadata = JSON.parse(decodeURI(obj.id));
    var path = fileMetadata.path;
    setCurrentPath(path);
    if(fileMetadata.directory == true) {
        getFolderContentsByPath(path, function(contents) {
            stopLoading();
            updateListView(contents);
        });
    } else {
        downloadFileByPath(path, function (blobFile) {
            stopLoading();
            download(blobFile, getFileName(), "text/html");
        });
    }
}

var getFolderContentsClickedFromPathTool = function(obj) {
    startLoading();
    var path = obj.id;
    setCurrentPath(path);
    getFolderContentsByPath(path, function(contents) {
        stopLoading();
        updateListView(contents);
    });
}

var updateListView = function(contents) {
    var innerHtml = "";
    contents.forEach(function(file) {
        var i = 0;
        var imgType = (file.directory == true) ? "dir.PNG" : "file.PNG";
        innerHtml += htmlString[i++] + encodeURI(JSON.stringify(file)) + htmlString[i++] + imgType + htmlString[i++] +
            file.name + htmlString[i++] + parseDate(file.modifiedDate) + htmlString[i++] + getSizeInMB(file.size) +
            htmlString[i++];

    });
    document.getElementById("listDir").innerHTML = innerHtml;
    setHeightToLeftPane();
    setPathTool();
}

var parseDate = function (dateString) {
    var d = new Date(dateString);
    var months = ["Jan", "Feb", "Mar", "Apr",
        "May", "Jun", "Jul", "Aug", "Sep",
        "Oct", "Nov", "Dec"];
    return (months[d.getMonth()] + " " + d.getDate() + " , " + d.getFullYear());
}

var stopLoading = function() {
    document.getElementById("main_component").style.opacity = "1";
    document.getElementById("loading_component").style.visibility = "hidden";
}

var startLoading = function() {
    document.getElementById("main_component").style.opacity = "0.5";
    document.getElementById("loading_component").style.visibility = "visible";
}

var getFileName = function () {
    var path = getCurrentPath();
    return path.substring(path.lastIndexOf('/') + 1, path.length);
}

var getSizeInMB = function(bytes) {
    
    if      (bytes >= 1073741824) { bytes = (bytes / 1073741824).toFixed(2) + " GB"; }
    else if (bytes >= 1048576)    { bytes = (bytes / 1048576).toFixed(2) + " MB"; }
    else if (bytes >= 1024)       { bytes = (bytes / 1024).toFixed(2) + " KB"; }
    else if (bytes > 1)           { bytes = bytes + " bytes"; }
    else if (bytes == 1)          { bytes = bytes + " byte"; }
    else                          { bytes = "0 bytes"; }
    return bytes;
}

var getHeight = function () {
    var body = document.body,
        html = document.documentElement;

    var height = Math.max( body.scrollHeight, body.offsetHeight,
        html.clientHeight, html.scrollHeight, html.offsetHeight );
    return height;
}

var setHeightToLeftPane = function () {
    document.getElementById("left_pane").style.height = getHeight() + "px";
}

var setPathTool = function () {
    var path = getCurrentPath();
    var dir = path.split("/");
    var innerHtml = "";
    var pathTillCurrentDir = "/";
    innerHtml += '<a href="#" id="' + pathTillCurrentDir + '" onclick="getFolderContentsClickedFromPathTool(this)">All Files  -  </a>'
    dir.forEach(function (currentDir) {
        if(currentDir != "") {
            pathTillCurrentDir += currentDir;
            innerHtml += '<a href="#" id="' + pathTillCurrentDir + '" onclick="getFolderContentsClickedFromPathTool(this)">' + currentDir + '  -  </a>';
        }
    });
    document.getElementById("path_tool").innerHTML = innerHtml;
}

