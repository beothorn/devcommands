devcmd = {
    toParams:function(obj) {
        var asString = "";
        var pairs = [];
        for (let key of Object.keys(obj)) {
            pairs.push(key+"="+obj[key]);
        }
        return pairs.join('&');
    },
    /***
    * postConfig {url,parameters,headers}
    ***/
    post:function(postConfig, successCallback,failureCallback){
        var http = new XMLHttpRequest();
        var params = {};
        if(postConfig.parameters)
            params = glob_comands.toParams(postConfig.parameters);
        http.open("POST", (postConfig.url || '.'), true);
        
        if(postConfig.headers){
            for (let key of Object.keys(postConfig.headers)) {
                http.setRequestHeader(key, postConfig.headers[key]);
            }
        }
        http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        http.onreadystatechange = function() {
            var done = 4;
            var statusOK = 200;
            if(http.readyState == done){
                if(http.readyState == 4 && http.status == statusOK) {
                    if(successCallback)
                        successCallback(http.responseText);
                    else
                        console.log(http.responseText);
                }else{
                    if(failureCallback)
                        failureCallback(http.responseText, http.status);
                    else
                        console.error(http.status+':\n'+http.responseText);
                }
            }
        }
        http.send(params);
    }
};
