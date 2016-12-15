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
    },
    outputHtml:function(html_string,iframeId){
        var id = id || 'notimportant';
        if (document.getElementById(id)){
            devcmd.removeElement('#'+id);
        }
        var elemtIFrame = document.createElement('iframe');
        elemtIFrame.style.cssText = 'position:absolute;width:100%;height:100%;opacity:0.3;z-index:100;';
        elemtIFrame.id = id;
        document.body.appendChild(elemtIFrame);
        elemtIFrame.src = "data:text/html;charset=utf-8," + escape(html_string);
    },
    allValuesForSelect:function(query){
        var sel = document.querySelector(query);
        var allVals = [];
        for (var i = 0; i < sel.options.length; i++) {
            allVals[i] = sel.options[i].value;
        }
        return allVals;
    },
    combine:function(){
        if(arguments.length == 1){
            return arguments[0];
        }else{
            var combs = [];
            var followingCombinations = devcmd.combine.apply(this, Array.prototype.slice.call(arguments, 1));
            var values = arguments[0];
            for(var i=0; i<values.length;i++){
                for(var j=0; j<followingCombinations.length;j++){
                    combs.push([values[i]].concat(followingCombinations[j]));
                }
            }
            return combs;
        }
    },
    removeElement:function(query){
        var element = document.querySelector(query);
        element.outerHTML = "";
        delete element;
    }
};
