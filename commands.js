dev = {
    /***
    * Outputs a parameter string from an input json
    * ex: {"foo":"bar","baz":"qux"}
    * returns "foo=bar&baz=qux"
    * obj a json
    ***/
    toParams:function(obj) {
        var asString = "";
        var pairs = [];
        for (let key of Object.keys(obj)) {
            pairs.push(key+"="+obj[key]);
        }
        return pairs.join('&');
    },
    /***
    * Run a ajax post request
    * ex:
    * devcmd.post({
    *   url:'/url/to/do/something.php',
    *   parameter:{
    *     'token':'foo',
    *     'myValue':'42'
    *   }
    * }, devcmd.outputHtml)
    * 
    * postConfig a json with {url,parameters(optional),headers(optional)}
    * successCallback called when return status is OK
    * failureCallback called on any other status
    ***/
    post:function(postConfig, successCallback,failureCallback){
        var http = new XMLHttpRequest();
        var params = {};
        if(postConfig.parameters)
            params = devcmd.toParams(postConfig.parameters);
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
    dev.postUrl = function(url){dev.post({url:url})},
    /***
    * Outputs html on a Iframe
    * html_string
    * iframeId (optional)
    ***/
    outputHtml:function(html_string,iframeId){
        var id = id || 'notimportant';
        if (document.getElementById(id)){
            devcmd.removeElement('#'+id);
        }
        var elemtIFrame = document.createElement('iframe');
        elemtIFrame.style.cssText = 'width:100%;z-index:100;';
        elemtIFrame.id = id;
        document.body.appendChild(elemtIFrame);
        elemtIFrame.src = "data:text/html;charset=utf-8," + escape(html_string);
    },
    /***
    * Returns an array with all possible values for a select
    * query A query that returns the select element
    ***/
    allValuesForSelect:function(query){
        var sel = document.querySelector(query);
        var allVals = [];
        for (var i = 0; i < sel.options.length; i++) {
            allVals[i] = sel.options[i].value;
        }
        return allVals;
    },
    /***
    * Combine N arrays as a flat array with all combinations
    * ex
    * devcmd.combine([1,2],[2,3],[3,4])
    * outputs
    * "[[1,2,3],[1,2,4],[1,3,3],[1,3,4],[2,2,3],[2,2,4],[2,3,3],[2,3,4]]"
    ***/
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
    /***
    * Removes a element
    ***/
    removeElement:function(query){
        var element = document.querySelector(query);
        element.outerHTML = "";
        delete element;
    },
    editPage(){
        document.body.contentEditable=true;
    }
    //TODO: chrome perf tools here (see https://medium.freecodecamp.com/10-tips-to-maximize-your-javascript-debugging-experience-b69a75859329#.9p62qm879)
    //TODO: matrix to console table ex: table(["colA","colB"],[[1,2][3,4]]);
};
