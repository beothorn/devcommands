devcmd = {
    /***
    * Outputs a parameter string from an input json
    * ex: 
    * dev.toParams({"foo":"bar","baz":"qux"});
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
    * dev.post('http://www.example.com/dosomething',{'token':'foo','myValue':'42'}})
    * or
    * dev.post('http://www.example.com/dosomething',{'token':'foo','myValue':'42'}}, devcmd.appendOnPage)
    * 
    * url
    * parameters
    * successCallback called when return status is OK
    * failureCallback called on any other status
    ***/
    post:function(url, parameters, successCallback, failureCallback, headers){
        var http = new XMLHttpRequest();
        var params = {};
        if(parameters)
            params = this.toParams(parameters);
        http.open("POST", (url || '.'), true);
        
        http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        if(headers){
            for (let key of Object.keys(headers)) {
                http.setRequestHeader(key, headers[key]);
            }
        }
        
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
    /***
    * Run a ajax get request
    * ex:
    * dev.get("http://www.example.com/dosomething")
    * or
    * dev.get("http://www.example.com/dosomething", devcmd.appendOnPage)
    * 
    * postConfig a json with {url,parameters(optional),headers(optional)}
    * successCallback called when return status is OK
    * failureCallback called on any other status
    ***/
    get:function(url, successCallback, failureCallback, headers){
        var http = new XMLHttpRequest();
        http.open("GET", url, true);

        http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        if(headers){
            for (let key of Object.keys(headers)) {
                http.setRequestHeader(key, headers[key]);
            }
        }
        
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
        http.send();
    },
    /***
    * Appends an Iframe to the bottom of the page and writes in it
    *
    * html_string string to be appended
    * iframeId (optional)
    ***/
    appendOnPage:function(html_string,iframeId){
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
    editPage:function(){
        document.body.contentEditable=true;
    },
    stopAnimations:function(){
        for(var i = 0; i <= 100000; i++){
            window.cancelAnimationFrame(i);
        }
    },
    /***
    * Use this to pass function as param
    ***/
    out : console.log.bind(console)
    //TODO: chrome perf tools here (see https://medium.freecodecamp.com/10-tips-to-maximize-your-javascript-debugging-experience-b69a75859329#.9p62qm879)
    //TODO: matrix to console table ex: table(["colA","colB"],[[1,2][3,4]]);
};

console.log("Methods:\n devcmd."+Object.getOwnPropertyNames(devcmd).join("\n devcmd."));
"Loaded devcmd";
