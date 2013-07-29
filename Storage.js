/**
* Data Storage - UserData(IE),Cookie,LocalStorage 
* The MIT License - Copyright (c) 2013 Hongbo Yang <abcrun@gmail.com>
* Repository - https://github.com/abcrun/sack.git
*/

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
                o.load(name);
                return o.getAttribute(name);
            },
            set: function(name,value,seconds){
                if(seconds){
                    var d = new Date();
                    d.setTime(d.getTime() + seconds*1000);
                    o.expires = d.toUTCString();
                }
                o.setAttribute(name,value);
                o.save(name);
            },
            add: function(name,value,seconds){
                o.load(name);
                var v = o.getAttribute(name) || '';
                if(!v) return this.set(name,value,seconds);
                var rValue = new RegExp('(?:^|,)' + value);
                if(value && !rValue.test(v)){
                    o.setAttribute(name,value + ',' + v);
                }
                o.save(name);
            },
            remove: function(name,value){
                o.load(name);
                var v = o.getAttribute(name) || '';
                if(!v) return;
                if(value){
                    var rValue = new RegExp('(?:^|,)' + value),value = v.replace(rValue,'');
                    this.set(name,value);
                }else{
                    o.removeAttribute(name);
                    o.save(name);
                }
            }
        }
	};

	var _localStorage = {
		get: function(name){
			var v = localStorage.getItem(name),d = new Date().getTime(),exReg = /^\[(\d+)\],/,expires = exReg.exec(v);
            if(expires){
                if(expires[1] <= d){
                    localStorage.removeItem(name);
                    v = null; 
                }else{
                    v = v.replace(exReg,'');
                }
            }
			return v;
		},
		set: function(name,value,seconds){
			var expires = '';
			if(seconds){
				var d = new Date().getTime();
				expires = '[' + (d + seconds*1000) + '],';
			}
			localStorage.setItem(name,expires + value);
		},
		add: function(name,value,seconds){
			var v = this.get(name) || '';
			if(!v) return this.set(name,value,seconds);

            var expires = /^\[\d+\]/.exec(localStorage.getItem(name));
            if(expires) expires = expires[0] + ',';
            else expires = ''
			var rValue = new RegExp('(?:,|^)' + value);
			if(value && !rValue.test(v)){
				localStorage.setItem(name,expires + value + ',' + v);
			}
		},
		remove: function(name,value){
			var v = this.get(name) || '';
			if(!v) return;
			if(value){
				var rValue = new RegExp('(?:,|^)' + value),value = v.replace(rValue,'');
				this.set(name,value);
			}else{
				localStorage.removeItem(name);
			}
		}
	}
	var cookie = {
		get: function(name){
			var v = document.cookie;
			var start = v.indexOf(name + '='),end = v.indexOf(';',start);
			if(end == -1) end = v.length;
			if(start > -1){
				return v.substring(start + name.length + 1,end);
			}else{
				return null;
			}
		},
		set: function(name,value,seconds,domain,path){
			var domain = domain || document.domain,path = path || '/',expires = '';
			if(seconds){
				if(window.ActiveXObject){
					var d = new Date();
					d.setTime(d.getTime() + seconds*1000);
					expires = 'expires=' + d.toGMTString();
				}else{
					expires = 'max-age=' + seconds;
				}
			}
			document.cookie = name + '=' + value + ';path=' + path + ';domain=' + domain + ';' + expires;
		},
		add: function(name,value,seconds,domain,path){
			var v = this.get(name) || '';
			if(!v) return this.set(name,value,seconds,domain,path);
			var rValue = new RegExp('(?:^|,)' + value);
			if(!rValue.test(v)) this.set(name,value + ',' + v,seconds,domain,path);
		},
		remove: function(name,value,seconds,domain,path){
			var v = this.get(name) || '';
			if(!v) return;
			if(value){
				var rValue = new RegExp('(?:,|^)' + value),value = v.replace(rValue,'');
				this.set(name,value,days,domain,path);
			}else{
				this.set(name,value,0,domain,path);
			}
		}
	}

    var adapter = _localStorage;
    if(!window.localStorage){
        adapter = userData();
    }

	return {
        get:adapter.get,
        set:adapter.set,
        add:adapter.add,
        remove:adapter.remove,
		cookie:cookie
	}
})
