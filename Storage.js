/**
* Data Storage - UserData(IE),Cookie,LocalStorage 
* The MIT License - Author: <abcrun@gmail.com>
* Repository - https://github.com/abcrun/Storage.git
* Required json2.js@https://github.com/douglascrockford/JSON-js.git
* Version - 0.3.1
*/

/*json2.js@https://github.com/douglascrockford/JSON-js.git*/
if(typeof JSON!=="object"){JSON={}}(function(){"use strict";function f(n){return n<10?"0"+n:n}if(typeof Date.prototype.toJSON!=="function"){Date.prototype.toJSON=function(){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+f(this.getUTCMonth()+1)+"-"+f(this.getUTCDate())+"T"+f(this.getUTCHours())+":"+f(this.getUTCMinutes())+":"+f(this.getUTCSeconds())+"Z":null};String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(){return this.valueOf()}}var cx,escapable,gap,indent,meta,rep;function quote(string){escapable.lastIndex=0;return escapable.test(string)?'"'+string.replace(escapable,function(a){var c=meta[a];return typeof c==="string"?c:"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+string+'"'}function str(key,holder){var i,k,v,length,mind=gap,partial,value=holder[key];if(value&&typeof value==="object"&&typeof value.toJSON==="function"){value=value.toJSON(key)}if(typeof rep==="function"){value=rep.call(holder,key,value)}switch(typeof value){case"string":return quote(value);case"number":return isFinite(value)?String(value):"null";case"boolean":case"null":return String(value);case"object":if(!value){return"null"}gap+=indent;partial=[];if(Object.prototype.toString.apply(value)==="[object Array]"){length=value.length;for(i=0;i<length;i+=1){partial[i]=str(i,value)||"null"}v=partial.length===0?"[]":gap?"[\n"+gap+partial.join(",\n"+gap)+"\n"+mind+"]":"["+partial.join(",")+"]";gap=mind;return v}if(rep&&typeof rep==="object"){length=rep.length;for(i=0;i<length;i+=1){if(typeof rep[i]==="string"){k=rep[i];v=str(k,value);if(v){partial.push(quote(k)+(gap?": ":":")+v)}}}}else{for(k in value){if(Object.prototype.hasOwnProperty.call(value,k)){v=str(k,value);if(v){partial.push(quote(k)+(gap?": ":":")+v)}}}}v=partial.length===0?"{}":gap?"{\n"+gap+partial.join(",\n"+gap)+"\n"+mind+"}":"{"+partial.join(",")+"}";gap=mind;return v}}if(typeof JSON.stringify!=="function"){escapable=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;meta={"\b":"\\b","	":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"};JSON.stringify=function(value,replacer,space){var i;gap="";indent="";if(typeof space==="number"){for(i=0;i<space;i+=1){indent+=" "}}else if(typeof space==="string"){indent=space}rep=replacer;if(replacer&&typeof replacer!=="function"&&(typeof replacer!=="object"||typeof replacer.length!=="number")){throw new Error("JSON.stringify")}return str("",{"":value})}}if(typeof JSON.parse!=="function"){cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;JSON.parse=function(text,reviver){var j;function walk(holder,key){var k,v,value=holder[key];if(value&&typeof value==="object"){for(k in value){if(Object.prototype.hasOwnProperty.call(value,k)){v=walk(value,k);if(v!==undefined){value[k]=v}else{delete value[k]}}}}return reviver.call(holder,key,value)}text=String(text);cx.lastIndex=0;if(cx.test(text)){text=text.replace(cx,function(a){return"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})}if(/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,""))){j=eval("("+text+")");return typeof reviver==="function"?walk({"":j},""):j}throw new SyntaxError("JSON.parse")}}})();

(function(name,factory){
    if(typeof define === 'function' && define.amd) define(factory);//AMD
    else if(typeof module === 'object' && module.exports) module.exports = factory();//CommonJS
    else this[name] = factory();//Global
})('Storage',function(){
    var userData = function(){
        var o;
        //userData for IE: http://msdn.microsoft.com/zh-cn/vstudio/ms531424
        //As userData has the PATH rules, we need to break the rules in order to use it in all the current domain
        //So we need an iframe
        try{
            var htmlfile = new ActiveXObject('htmlfile'),doc,o;
            htmlfile.open();
            htmlfile.write('<iframe src="/favicon.ico"></iframe>');
            htmlfile.close();
            doc = htmlfile.frames[0].document;
            o = doc.createElement('div');
            doc.appendChild(o);
            o.addBehavior('#default#userData');
        }catch(e){}

        return {
            get: function(name){
                var value;
                o.load(name);

                value = o.getAttribute(name);
                try{value = JSON.parse(value)}catch(e){}
                return value;
            },
            set: function(name,value,seconds){
                if(seconds){
                    var d = new Date();
                    d.setTime(d.getTime() + seconds*1000);
                    o.expires = d.toUTCString();
                }
                o.setAttribute(name,JSON.stringify(value));
                o.save(name);
            },
            remove: function(name){
                o.removeAttribute(name);
                o.save(name);
            }
        }
    };

    var _localStorage = function(){
        //Clear the outdated data
        var d = new Date().getTime();
        for(key in localStorage){
            var v = localStorage.getItem(key);
            //If you add storage throw localStorage.setItem("abc","abcvalue") not Storage.set("abc","abcvalue"),it will catch an error when parse the value "abcvalue" 
            try{v = JSON.parse(v)}catch(e){};
            if(Object.prototype.toString.call(v).toLowerCase().indexOf('array') > 0){
                var expires = v[0].expires;
                if(expires && /^\d{13,}$/.test(expires) && expires <= d) localStorage.removeItem(key);
            }
        }
        return {
            get: function(name){
                var v = localStorage.getItem(name);
                if(!v) return null;
                try{v = JSON.parse(v)}catch(e){};
                if(typeof v != 'object') return v;
                //If the first element is an object with "expires" property, it may be an expiring date(number at least 13 digits) of the current data. 
                var expires = v[0].expires;
                if(expires && /^\d{13,}$/.test(expires)){
                    var d = new Date().getTime();
                    if(expires <= d){
                        localStorage.removeItem(name);
                        return null;
                    }
                    v.shift();
                }
                return v[0];
            },
            set: function(name,value,seconds){
                var v = [];
                if(seconds){
                    var d = new Date().getTime();
                    v.push({"expires":(d + seconds*1000)});
                }
                v.push(value);
                localStorage.setItem(name,JSON.stringify(v));
            },
            remove: function(name){
                localStorage.removeItem(name);
            }
        }
    }
    var cookie = {
        get: function(name){
            var v = document.cookie,result;
            var start = v.indexOf(name + '='),end = v.indexOf(';',start);
            if(end == -1) end = v.length;
            if(start > -1){
                result = v.substring(start + name.length + 1,end);
                try{result = JSON.parse(result)}catch(e){};
                return result;
            }else{
                return null;
            }
        },
        set: function(name,value,seconds,path,domain){
            var path = path || '/',expires = '';
            if(seconds){
                //IE:expires,Others:max-age
                if(window.ActiveXObject){
                    var d = new Date();
                    d.setTime(d.getTime() + seconds*1000);
                    expires = 'expires=' + d.toGMTString();
                }else{
                    expires = 'max-age=' + seconds;
                }
            }
            document.cookie = name + '=' + JSON.stringify(value) + ';' + expires + ';path=' + path + ';' + (domain ? ('domain=' + domain):'');
        },
        remove: function(name,path,domain){
            this.set(name,'',-1,path,domain);
        }
    }

    var adapter;
    if(!window.localStorage){
        adapter = userData();
    }else{
        adapter = _localStorage();
    }

    return {
        get:adapter.get,
        set:adapter.set,
        remove:adapter.remove,
        cookie:cookie
    }
})
