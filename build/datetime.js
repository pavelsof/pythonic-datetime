var datetime=function(){"use strict";var t=function(t){return!isNaN(parseInt(t))},n=function(n){if(!t(n))throw new TypeError;return parseInt(n)},e=function(t){return!isNaN(parseFloat(t))},i=function(t){if(!e(t))throw new TypeError;return parseFloat(t)},r=function(t,n){for(var e=0;e<n.length;e++)if(!t.hasOwnProperty(n[e]))return!1;return!0},o=function(t){return r(t,["days","seconds","milliseconds"])},s=function(t){return r(t,["year","month","day"])},u=function(t){return r(t,["year","month","day","hour","minute","second","millisecond","tzinfo"])},a=function(t){return r(t,["hour","minute","second","millisecond"])},c=function(t){return r(t,["offset"])},h=function(t,n){n||(n=2);var e,i="";for(e=1;n>e;e++)t<Math.pow(10,e)&&(i+="0");return i+t.toString()},m=function(t,n){var e,i={};for(e=0;e<t.length;e++)i[n[e]]=t[e];return i},f=function(t,n){var e,i=[];for(e=0;e<n.length;e++)t.hasOwnProperty(n[e])?i.push(t[n[e]]):i.push(0);return i},d=function(t,n,e){return n<t.length?t[n]:e},l=function(t,n){var e,i,r="";for(e=0;e<n.length;e++)i?("%"==n[e]?r+="%":_.hasOwnProperty(n[e])&&(r+=_[n[e]](t)),i=!1):"%"==n[e]?i=!0:r+=n[e];return r},y=function(t){return Object.freeze?Object.freeze(t):t},p=function(n,e,i,r){if(0==r.length)throw new TypeError;var o=r[0];(r.length>1||t(r[0]))&&(o=m(r,i));for(var s=0;s<i.length;s++)i[s]in o||(o[i[s]]=e[i[s]]);return n.init(o)},g=function(t,n){return n>t?-1:t>n?1:0},w=function(){this.days=0,this.seconds=0,this.milliseconds=0};w.init=function(){if(0==arguments.length)return y(new w);var e=arguments;1!=arguments.length||t(arguments[0])||(e=f(arguments[0],["days","seconds","milliseconds","minutes","hours","weeks"]));var i=new w;return i.days=n(d(e,0,0)),i.seconds=n(d(e,1,0)),i.milliseconds=n(d(e,2,0)),i.seconds+=60*n(d(e,3,0)),i.seconds+=3600*n(d(e,4,0)),i.days+=7*n(d(e,5,0)),i.milliseconds>=1e3&&(i.seconds+=parseInt(i.milliseconds/1e3),i.milliseconds%=1e3),i.seconds>=86400&&(i.days+=parseInt(i.seconds/86400),i.seconds%=86400),y(i)},w.prototype.total_seconds=function(){var t=this.seconds;return t+=24*this.days*3600,t+=.001*this.milliseconds},w.prototype.compare=function(t){if(!o(t))throw new TypeError;var n;return(n=g(this.days,t.days))?n:(n=g(this.seconds,t.seconds))?n:(n=g(this.milliseconds,t.milliseconds),n?n:0)},w.prototype.add=function(t){if(!o(t))throw new TypeError;return w.init(this.days+t.days,this.seconds+t.seconds,this.milliseconds+t.milliseconds)},w.prototype.subtract=function(t){if(!o(t))throw new TypeError;return w.init(this.days-t.days,this.seconds-t.seconds,this.milliseconds-t.milliseconds)},w.prototype.multiply=function(t){if(!e(t))throw new TypeError;var n=this.total_seconds()*i(t);return w.init(0,parseInt(n),n%1*1e3)},w.prototype.divide=function(t){if(o(t))return this.total_seconds()/t.total_seconds();if(e(t)){var n=this.total_seconds()/i(t);return w.init(0,parseInt(n),n%1*1e3)}throw new TypeError};var v=function(){this.year=null,this.month=null,this.day=null};v.init=function(){var t=arguments;if(1==arguments.length&&(t=f(arguments[0],["year","month","day"])),3!=t.length)throw new TypeError;var e=new v;return e.year=n(t[0]),e.month=n(t[1]),e.day=n(t[2]),y(e)},v.init.today=function(){var t=new Date;return v.init(t.getFullYear(),t.getMonth()+1,t.getDate())},v.init.fromtimestamp=function(t){var n=new Date(1e3*t);return v.init(n.getFullYear(),n.getMonth()+1,n.getDate())},v.prototype.replace=function(){return p(v,this,["year","month","day"],arguments)},v.prototype.weekday=function(){var t=new Date(this.year,this.month-1,this.day).getDay();return 0==t?6:t-1},v.prototype.isoweekday=function(){return this.weekday()+1},v.prototype.isoformat=function(){var t="";return t+=this.year+"-",t+=h(this.month)+"-",t+=h(this.day)},v.prototype.toString=function(){return this.isoformat()},v.prototype.strftime=function(t){return l(this,t)},v.prototype.compare=function(t){if(!s(t))throw new TypeError;var n;return(n=g(this.year,t.year))?n:(n=g(this.month,t.month))?n:(n=g(this.day,t.day),n?n:0)},v.prototype.add=function(t){if(!o(t))throw new TypeError;var n=z.init.combine(this,T.init(12,0));return t=w.init({days:t.days}),v.init.fromtimestamp(n.add(t).timestamp())},v.prototype.subtract=function(t){var n=z.init.combine(this,T.init(12,0));if(o(t)){var e=w.init({days:t.days});return v.init.fromtimestamp(n.subtract(e).timestamp())}if(s(t)){var i=z.init.combine(t,T.init(12,0));return w.init({seconds:n.timestamp()-i.timestamp()})}throw new TypeError};var z=function(){this.year=null,this.month=null,this.day=null,this.hour=0,this.minute=0,this.second=0,this.millisecond=0,this.tzinfo=null,this._date=null,this._time=null,this._timestamp=null};z.init=function(){var t=arguments;1==arguments.length&&(t=f(arguments[0],["year","month","day","hour","minute","second","millisecond","tzinfo"]),0==t[7]&&(t[7]=null));var e=new z;return e.year=n(d(t,0,null)),e.month=n(d(t,1,null)),e.day=n(d(t,2,null)),e.hour=n(d(t,3,0)),e.minute=n(d(t,4,0)),e.second=n(d(t,5,0)),e.millisecond=n(d(t,6,0)),e.tzinfo=d(t,7,null),e._date=v.init(e.year,e.month,e.day),e._time=T.init(e.hour,e.minute,e.second,e.millisecond,e.tzinfo),e.tzinfo?(e._timestamp=Date.UTC(e.year,e.month-1,e.day,e.hour,e.minute,e.second,e.millisecond)/1e3,e._timestamp-=e.tzinfo.utcoffset().total_seconds()):e._timestamp=new Date(e.year,e.month-1,e.day,e.hour,e.minute,e.second,e.millisecond)/1e3,y(e)},z.init.today=function(){var t=new Date;return z.init(t.getFullYear(),t.getMonth()+1,t.getDate(),t.getHours(),t.getMinutes(),t.getSeconds(),t.getMilliseconds(),null)},z.init.now=function(){return z.init.today()},z.init.utcnow=function(){var t=new Date;return z.init(t.getUTCFullYear(),t.getUTCMonth()+1,t.getUTCDate(),t.getUTCHours(),t.getUTCMinutes(),t.getUTCSeconds(),t.getUTCMilliseconds(),null)},z.init.fromtimestamp=function(t,n){if(!e(t))throw new TypeError;if(n&&!c(n))throw new TypeError;var i=new z;if(n){var r=t+n.utcoffset().total_seconds(),o=new Date(1e3*r);i.year=o.getUTCFullYear(),i.month=o.getUTCMonth()+1,i.day=o.getUTCDate(),i.hour=o.getUTCHours(),i.minute=o.getUTCMinutes(),i.second=o.getUTCSeconds(),i.millisecond=o.getUTCMilliseconds(),i.tzinfo=n}else{var o=new Date(1e3*t);i.year=o.getFullYear(),i.month=o.getMonth()+1,i.day=o.getDate(),i.hour=o.getHours(),i.minute=o.getMinutes(),i.second=o.getSeconds(),i.millisecond=o.getMilliseconds(),i.tzinfo=null}return i._date=v.init(i.year,i.month,i.day),i._time=T.init(i.hour,i.minute,i.second,i.millisecond,i.tzinfo),i._timestamp=t,y(i)},z.init.utcfromtimestamp=function(t){var n=60*(new Date).getTimezoneOffset(),e=new Date(1e3*t+n),i=new z;return i.year=e.getFullYear(),i.month=e.getMonth()+1,i.day=e.getDate(),i.hour=e.getHours(),i.minute=e.getMinutes(),i.second=e.getSeconds(),i.millisecond=e.getMilliseconds(),i.tzinfo=null,i._date=v.init(i.year,i.month,i.day),i._time=T.init(i.hour,i.minute,i.second,i.millisecond,i.tzinfo),i._timestamp=t+n,y(i)},z.init.combine=function(t,n){if(!s(t))throw new TypeError;if(!a(n))throw new TypeError;return z.init(t.year,t.month,t.day,n.hour,n.minute,n.second,n.millisecond,n.tzinfo)},z.init.strptime=function(t,n){var e,i,r,o={};for(e=0;e<n.length;e++)i?(M.hasOwnProperty(n[e])?(r=M[n[e]](t),o[r[0]]=r[1],t=r[2]):"%"==n[e]&&(t=t.substring(1)),i=!1):"%"==n[e]?i=!0:t=t.substring(1);return z.init(o)},z.prototype.date=function(){return this._date},z.prototype.time=function(){return T.init(this.hour,this.minute,this.second,this.millisecond)},z.prototype.timetz=function(){return this._time},z.prototype.replace=function(){return p(z,this,["year","month","day","hour","minute","second","millisecond","tzinfo"],arguments)},z.prototype.tzname=function(){return this.tzinfo?this.tzinfo.tzname():null},z.prototype.timestamp=function(){return this._timestamp},z.prototype.weekday=function(){return this._date.weekday()},z.prototype.isoweekday=function(){return this._date.isoweekday()},z.prototype.isoformat=function(t){return t||(t="T"),this._date.isoformat()+t+this._time.isoformat()},z.prototype.toString=function(){return this.isoformat()},z.prototype.strftime=function(t){return l(this,t)},z.prototype.compare=function(t){if(!u(t))throw new TypeError;if(this.tzinfo&&!t.tzinfo||!this.tzinfo&&t.tzinfo)throw new TypeError;return g(this._timestamp,t.timestamp())},z.prototype.add=function(t){if(!o(t))throw new TypeError;return z.init.fromtimestamp(this._timestamp+t.total_seconds(),this.tzinfo)},z.prototype.subtract=function(t){if(o(t))return z.init.fromtimestamp(this._timestamp-t.total_seconds(),this.tzinfo);if(u(t))return w.init({seconds:this._timestamp-t.timestamp()});throw new TypeError};var T=function(){this.hour=0,this.minute=0,this.second=0,this.millisecond=0,this.tzinfo=null};T.init=function(){if(0==arguments.length)return new T;var e=arguments;1!=arguments.length||t(arguments[0])||(e=f(arguments[0],["hour","minute","second","millisecond","tzinfo"]));var i=new T;return i.hour=n(d(e,0,0)),i.minute=n(d(e,1,0)),i.second=n(d(e,2,0)),i.millisecond=n(d(e,3,0)),i.tzinfo=d(e,4,null),y(i)},T.prototype.replace=function(){return p(T,this,["hour","minute","second","millisecond","tzinfo"],arguments)},T.prototype.isoformat=function(){var t=h(this.hour)+":"+h(this.minute)+":"+h(this.second);return this.millisecond&&(t+="."+h(this.millisecond,3)),this.tzinfo&&(t+=this.tzinfo.tzname().substring(3)),t},T.prototype.toString=function(){return this.isoformat()},T.prototype.strftime=function(t){return l(this,t)},T.prototype.tzname=function(){return this.tzinfo?this.tzinfo.tzname():null},T.prototype.compare=function(t){if(!a(t))throw new TypeError;var n;return(n=g(this.hour,t.hour))?n:(n=g(this.minute,t.minute))?n:(n=g(this.second,t.second))?n:(n=g(this.millisecond,t.millisecond),n?n:0)};var b=function(){this.offset=null,this.name=""};b.init=function(){if(0==arguments.length)throw new TypeError;var t=arguments;o(arguments[0])||(t=[],t.push(arguments[0].offset),arguments[0].hasOwnProperty("name")&&t.push(arguments[0].name));var n=new b;return n.offset=d(t,0),n.name=d(t,1,""),y(n)},b.init.utc=b.init(w.init()),b.prototype.utcoffset=function(){return this.offset},b.prototype.tzname=function(){if(this.name)return this.name;var t=this.offset.divide(w.init(0,3600)),n=t%1*60;if(!t)return"UTC";var e="UTC";return e+=t>0?"+":"-",e+=h(Math.abs(parseInt(t)))+":",e+=h(Math.abs(n))};var _={a:function(t){return _.A(t).substring(0,3)},A:function(t){return t.isoweekday?["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"][t.isoweekday()-1]:""},w:function(t){return t.weekday?h(t.weekday()):"00"},d:function(t){return t.day?h(t.day):"00"},b:function(t){return _.B(t).substring(0,3)},B:function(t){return t.month?["January","February","March","April","May","June","July","August","September","October","November","December"][t.month-1]:""},m:function(t){return t.month?h(t.month):"00"},y:function(t){return t.year?h(t.year.substring(2)):"00"},Y:function(t){return t.year?t.year:"0000"},H:function(t){return t.hour?h(t.hour):"00"},I:function(t){return"hour"in t?h(t.hour%12||12):"00"},p:function(t){return"hour"in t?t.hour<12?"AM":"PM":""},M:function(t){return t.minute?h(t.minute):"00"},S:function(t){return t.second?h(t.second):"00"},f:function(t){return t.millisecond?h(t.millisecond,3):"000"},z:function(t){var n=t.tzname();return n?"UTC"==n?"+0000":n.substring(3,6)+n.substring(7):""},Z:function(t){return t.tzname?t.tzname():""},j:function(t){return""},U:function(t){return""},W:function(t){return""},c:function(t){return t.year&&t.month&&t.day?(s(t)&&(t=z.init.combine(t,T.init())),new Date(t.year,t.month-1,t.day,t.hour,t.minute,t.second,t.millisecond).toLocaleString()):""},x:function(t){return t.year&&t.month&&t.day?new Date(t.year,t.month-1,t.day).toLocaleDateString():""},X:function(t){return a(t)&&(t=z.init.combine(v.init.today(),t)),new Date(t.year,t.month-1,t.day,t.hour,t.minute,t.second,t.millisecond).toLocaleTimeString()}},M={d:function(t){return["day",n(t.substring(0,2)),t.substring(2)]},m:function(t){return["month",n(t.substring(0,2)),t.substring(2)]},Y:function(t){return["year",n(t.substring(0,4)),t.substring(4)]},H:function(t){return["hour",n(t.substring(0,2)),t.substring(2)]},M:function(t){return["minute",n(t.substring(0,2)),t.substring(2)]},S:function(t){return["second",n(t.substring(0,2)),t.substring(2)]},f:function(t){return["millisecond",n(t.substring(0,3)),t.substring(3)]}};return{timedelta:w.init,date:v.init,datetime:z.init,time:T.init,timezone:b.init}}();