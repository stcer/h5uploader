!function(e){var t={};function n(r){if(t[r])return t[r].exports;var i=t[r]={i:r,l:!1,exports:{}};return e[r].call(i.exports,i,i.exports,n),i.l=!0,i.exports}n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var i in e)n.d(r,i,function(t){return e[t]}.bind(null,i));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=0)}([function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r,i=n(1),o=(r=i)&&r.__esModule?r:{default:r};n(7),window.H5ImgUploader=o.default,t.default=o.default},function(module,exports,__webpack_require__){"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var _ImgPicker=__webpack_require__(2),_ImgPicker2=_interopRequireDefault(_ImgPicker),_ImgEditor=__webpack_require__(3),_ImgEditor2=_interopRequireDefault(_ImgEditor),_Uploader=__webpack_require__(4),_Uploader2=_interopRequireDefault(_Uploader),_HtmlDom=__webpack_require__(5);function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}var F=function(e,t,n,r){this.name=e,this.images=t,this.opts=$.extend({mul:!1,setCoverField:!1,coverFieldName:"image",mime:"image/*",type:/image.(png|jpeg|gif|jpg)/,maxSize:4194304,maxItems:12,loading:"http://ui.jc001.cn/images/loading.gif",upload:"/upload/save",fileName:"media",dataFormat:"file",transData:{},outerLink:[],uploadHandleHtml:null,onUpload:function(e){},onSend:function(e){}},r),this.isSetCover=!1,this.dom=new _HtmlDom.HtmlDom(n,this.opts.outerLink,this.opts.uploadHandleHtml),this.imgPicker=new _ImgPicker2.default(n,{mul:this.opts.mul,mime:this.opts.mime}),this.imgEditor=new _ImgEditor2.default({maxWidth:this.opts.maxWidth,quality:this.opts.quality,dataFormat:this.opts.dataFormat})};F.prototype={init:function(){var e=this,t=this;this.dom.init(),this.dom.getSelector().click((function(){e.selectFile()})),this.dom.linksImgWrap.click((function(){t.linksSelect($(this))})),this.setImages(this.images)},linksSelect:function(e){var t=this.dom.linksImgWrap;t.removeClass("cur"),e.addClass("cur"),this.setImages([this.opts.outerLink[t.index(e)]])},selectFile:function(){var e=this;if(!this._isAbleUpload())return!1;this.imgPicker.select((function(t){var n=e.createImage(e.opts.loading);e._saveAndRender(t,n)}))},setImages:function(e){var t=this;this.clear(),e&&e.forEach((function(e){0!==e.length&&t.createImage(e).setValue(e)}))},_getSize:function(){return this.dom.getItemSize()},_isAbleUpload:function(){return 0===this._getSize()||this._isMulUpload()&&this._getSize()<this.opts.maxItems},_isMulUpload:function(){return!0===this.opts.mul},_isBase64:function(){return"base64"===this.opts.dataFormat},_saveAndRender:function(e,t){var n=this;this.opts.maxWidth||this.opts.opacity?this.imgEditor.getResult(e,(function(e,r){t.setUrl(n._isBase64()?e:URL.createObjectURL(e)),n._upload(e,r,t)})):(t.setUrl(URL.createObjectURL(e)),this._upload(e,e,t))},_upload:function _upload(data,file,img){var _this5=this,self=this,progress=img.progress;data=this._isBase64()?data.substr(data.indexOf(",")+1):data,(0,_Uploader2.default)(this.opts.upload,data,{fieldName:this.opts.fileName,fileName:file.name,format:self.opts.dataFormat,transData:self.opts.transData,onInit:function(){progress.show(),progress.val(0)},onProgress:function(e,t){progress.val(e/t*100)},onSuccess:function onSuccess(xhr){console.log(xhr.responseText);var response=eval("("+xhr.responseText+")");200===response.code?(progress.val(100),progress.hide(),img.setValue(response.data.url),self.opts.onUpload(response.data.url)):(alert("上传失败, "+response.message),_this5._removeImg(img))},onError:function(e){alert("上传失败("+e.status+")"),_this5._removeImg(img)},onSend:function(e){self.opts.onSend(e)}})},getFieldName:function(){return this.opts.mul&&this.opts.setCoverField&&!this.isSetCover?(this.isSetCover=!0,this.opts.coverFieldName):this.opts.mul?this.name+"[]":this.name},clear:function(){this.dom.clearItems(),this._checkSelectorShow()},createImage:function(e,t){var n=this;t||this._isAbleUpload()||this.clear();var r=this.dom.createImg(this.getFieldName(),e,t);return r.image.click((function(){n.imgPicker.select((function(e){n._saveAndRender(e,r)}))})),r.deleteImg.click((function(e){e.stopPropagation(),n._removeImg(r),n.isSetCover&&n.dom.changeCoverImg(n.opts.coverFieldName)})),this._checkSelectorShow(),r},_removeImg:function(e){e.remove(),this._checkSelectorShow()},_checkSelectorShow:function(){this._isAbleUpload()?this.dom.selectorShow():this.dom.selectorHide()}},exports.default=F},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=function(e,t){this.opts=$.extend({mul:!0,mime:"image/*",type:/image.(png|jpeg|gif|jpg)/,maxSize:16777216},t),this.callback=function(e){},this.init(e)};r.prototype={init:function(e){var t=$('<input type="file" style="width:0; height:0;" '+(this.opts.mul?"multiple":"")+' accept="'+this.opts.mime+'">');e.prepend(t);var n=this;t.change((function(e){e=e||window.event,n._getFiles(e.target.files)})),this.input=t},select:function(e){this.callback=e,this.input.click()},_getFiles:function(e){for(var t,n=this.opts.type,r=this.opts.maxSize,i=0;t=e[i];i++)0==t.type.length&&t.name.length>0&&!/\.(jpg|png|gif)$/.test(t.name.toLowerCase())||t.type.length>0&&!n.test(t.type.toLowerCase())?alert('"'+t.name+'" 类型不是图片'):t.size>r?alert('"'+t.name+'" 大于'+r/1024/1024+"M"):this.callback(t)}},t.default=r},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=function(e){this.opts=$.extend({maxWidth:0,quality:.7,dataFormat:"base64"},e)};r.prototype={getResult:function(e,t){var n=this,r=parseInt(this.opts.maxWidth),i=parseFloat(this.opts.quality),o=URL.createObjectURL(e);0==i&&(i=1);var s=new Image;s.addEventListener("load",(function(){var a=s.width,l=s.height,u=a/l;r>0&&a>r&&(a=r,l=parseInt(a/u));var p=document.createElement("canvas"),c=p.getContext("2d");if(p.width=a,p.height=l,c.drawImage(s,0,0,a,l),URL.revokeObjectURL(o),"base64"==n.opts.dataFormat){var d=p.toDataURL(e.type,i);p.width=0,p.height=0,p=null,t(d,e)}else p.toBlob((function(n){t(n,e)}),e.type,i)}),!1),s.src=o}},t.default=r},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e,t,n){var r=new XMLHttpRequest;if(!r.upload)return!1;var i=$.extend({method:"POST",fileName:"media",transData:{},onInit:function(){},onProgress:function(e,t){},onError:function(e){},onSuccess:function(e){},onSend:function(e){}},n);i.onInit(),r.upload.addEventListener("progress",(function(e){e.lengthComputable&&i.onProgress(e.loaded,e.total)}),!1),r.onreadystatechange=function(e){4==r.readyState&&(200==r.status?i.onSuccess(r):i.onError(r))},r.open(i.method,e,!0);var o=new FormData;for(var s in o.append(i.fieldName,t),"base64"==i.format&&o.append("fileName",i.fileName),o.append("uploadFormat",i.format),i.transData)i.transData.hasOwnProperty(s)&&o.append(s,i.transData[s]);return i.onSend(o),r.send(o),!0}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.HtmlDom=s;var r,i=n(6),o=(r=i)&&r.__esModule?r:{default:r};function s(e,t,n){this.container=e,this.outerArr=t,this.uploadHandleHtml=n}s.prototype={init:function(){var e=this.outerArr,t="";e.forEach((function(e){t+='<div class="up_link-box" style="background:url('+e+') no-repeat center; background-size:cover;"></div>'})),this.container.addClass("h5_uploads"),this.container.append($('\n        <div class="jH5Uploader">\n            <div class="up_selector">'+(this.uploadHandleHtml||'<div class="up_selector icon-plus2 glyphicon glyphicon-camera"></div>')+"</div>\n            "+(e.length?'<div class="up_links icon-plus2 glyphicon glyphicon-th"></div>':"")+'\n            <div class="up_list"></div>\n        </div>\n        <div class="up_links-pop">\n            <div class="up_links-boxs">\n                <div class="up_link-back">返回</div>\n                <div class="up_link-boxs">'+t+"</div>\n            </div>\n        </div>\n        ")),this.itemsWrap=$(".up_list",this.container),this.selectorWrap=$(".up_selector",this.container),this.linksWrap=$(".up_links",this.container),this.linksImgWrap=$(".up_link-box",this.container);var n=$(".up_links-pop",this.container);this.linksWrap.click((function(){n.fadeIn()})),n.click((function(){n.fadeOut()}))},getItems:function(){return this.itemsWrap},getSelector:function(){return this.selectorWrap},selectorShow:function(){this.selectorWrap.show()},selectorHide:function(){this.selectorWrap.hide()},getItemSize:function(){return this.itemsWrap.find(".up_item").size()},clearItems:function(){this.itemsWrap.html("")},createImg:function(e,t,n){return new o.default(e,t,this.itemsWrap,n)},changeCoverImg:function(e){if(0===$("input[name="+e+"]",this.itemsWrap).size()){var t=$(">:first-child",this.itemsWrap);$("input[type=hidden]",t).attr("name",e)}}}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=function(e,t,n,r){var i=$('\n<div class="up_item">\n    <input type="hidden" name="'+e+'" />\n    <img src="'+t+'" />\n    <progress max="100" value="0"></progress>\n    <a name="none" style="" class="up_close">×</a>\n</div>\n');n.append(i),this.root=i,this.deleteImg=$("a",i),this.progress=$("progress",i),this.image=$("img",i),this.value=$("input",i),r&&this.setValue(t)};r.prototype={setUrl:function(e){this.image.attr("src",e)},setValue:function(e){this.value.val(e)},remove:function(){this.root.remove()}},t.default=r},function(e,t,n){var r=n(8);"string"==typeof r&&(r=[[e.i,r,""]]);var i={hmr:!0,transform:void 0,insertInto:void 0};n(10)(r,i);r.locals&&(e.exports=r.locals)},function(e,t,n){(e.exports=n(9)(!1)).push([e.i,".h5_uploads::after{\r\n    content: \".\";\r\n    display: block;\r\n    height: 0;\r\n    clear: both;\r\n    visibility: hidden;\r\n}\r\n.h5_uploads { zoom: 1; }\r\n\r\n.h5_uploads .icon-plus2{\r\n    float: left;\r\n    width:80px;\r\n    height:80px; margin:5px;\r\n    cursor: pointer;\r\n    font-size:40px;\r\n    background:#fff;\r\n    color:gray;\r\n    line-height:80px;\r\n    text-align:center;\r\n    border:1px solid #ccc;\r\n}\r\n\r\n.h5_uploads .up_list{\r\n    display: inline;\r\n}\r\n\r\n.h5_uploads .up_item{\r\n    width:80px; height: 80px;\r\n    margin:5px; overflow: hidden;;\r\n    position: relative;\r\n    float: left;\r\n    display: flex;\r\n    flex-flow: row wrap;\r\n    align-items: center;\r\n    justify-content: center;\r\n    vertical-align: middle;\r\n}\r\n.h5_uploads .up_item a{\r\n    color:#fff;\r\n    position: absolute;\r\n    top:-3px; right: -3px;\r\n    background: #000;\r\n    opacity: 0.8;\r\n    cursor: pointer;\r\n    font-size: 12px;\r\n    padding:0 4px;\r\n    line-height:16px;\r\n}\r\n.h5_uploads .up_item progress{\r\n    width:100%;\r\n    margin-top:5px;\r\n    position: absolute;\r\n    bottom: 0;\r\n    left:0;\r\n    opacity: 0.5;\r\n    display: none;\r\n}\r\n.h5_uploads .up_item img{\r\n    max-width:100%;\r\n    cursor: pointer;\r\n}\r\n.up_links-pop {\r\n    position:fixed; top:0; bottom:0; left:0; right:0; z-index:100; background:rgba(0,0,0,.8); display:none;\r\n}\r\n.up_links-pop .up_links-boxs {\r\n    display:flex; flex-direction:column; height:100%;\r\n}\r\n.up_links-pop .up_links-boxs .up_link-back {\r\n    position:relative; background:#fff; padding:10px 0 10px 30px; cursor:pointer;\r\n}\r\n.up_links-pop .up_links-boxs .up_link-back:after {\r\n   position:absolute; content:''; width:10px; height:10px; border:1px solid #333; border-top:0; border-right:0;\r\n   transform:rotate(45deg); left:10px; top:15px;\r\n}\r\n.up_links-pop .up_links-boxs .up_link-boxs{flex:1; overflow:auto;}\r\n.up_links-pop .up_link-box {\r\n    float:left; width:25%; padding:10.5% 0; border:2px solid #fff; border-top:0; border-left:0; cursor:pointer;\r\n    text-align:center; overflow:hidden; box-sizing:border-box;\r\n}\r\n.up_links-pop .cur{outline:rgb(62, 147, 255) solid 2px; transition:all 0.2s ease 0s;}\r\n",""])},function(e,t){e.exports=function(e){var t=[];return t.toString=function(){return this.map((function(t){var n=function(e,t){var n=e[1]||"",r=e[3];if(!r)return n;if(t&&"function"==typeof btoa){var i=(s=r,"/*# sourceMappingURL=data:application/json;charset=utf-8;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(s))))+" */"),o=r.sources.map((function(e){return"/*# sourceURL="+r.sourceRoot+e+" */"}));return[n].concat(o).concat([i]).join("\n")}var s;return[n].join("\n")}(t,e);return t[2]?"@media "+t[2]+"{"+n+"}":n})).join("")},t.i=function(e,n){"string"==typeof e&&(e=[[null,e,""]]);for(var r={},i=0;i<this.length;i++){var o=this[i][0];"number"==typeof o&&(r[o]=!0)}for(i=0;i<e.length;i++){var s=e[i];"number"==typeof s[0]&&r[s[0]]||(n&&!s[2]?s[2]=n:n&&(s[2]="("+s[2]+") and ("+n+")"),t.push(s))}},t}},function(e,t,n){var r,i,o={},s=(r=function(){return window&&document&&document.all&&!window.atob},function(){return void 0===i&&(i=r.apply(this,arguments)),i}),a=function(e){return document.querySelector(e)},l=function(e){var t={};return function(e){if("function"==typeof e)return e();if(void 0===t[e]){var n=a.call(this,e);if(window.HTMLIFrameElement&&n instanceof window.HTMLIFrameElement)try{n=n.contentDocument.head}catch(e){n=null}t[e]=n}return t[e]}}(),u=null,p=0,c=[],d=n(11);function f(e,t){for(var n=0;n<e.length;n++){var r=e[n],i=o[r.id];if(i){i.refs++;for(var s=0;s<i.parts.length;s++)i.parts[s](r.parts[s]);for(;s<r.parts.length;s++)i.parts.push(b(r.parts[s],t))}else{var a=[];for(s=0;s<r.parts.length;s++)a.push(b(r.parts[s],t));o[r.id]={id:r.id,refs:1,parts:a}}}}function h(e,t){for(var n=[],r={},i=0;i<e.length;i++){var o=e[i],s=t.base?o[0]+t.base:o[0],a={css:o[1],media:o[2],sourceMap:o[3]};r[s]?r[s].parts.push(a):n.push(r[s]={id:s,parts:[a]})}return n}function m(e,t){var n=l(e.insertInto);if(!n)throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");var r=c[c.length-1];if("top"===e.insertAt)r?r.nextSibling?n.insertBefore(t,r.nextSibling):n.appendChild(t):n.insertBefore(t,n.firstChild),c.push(t);else if("bottom"===e.insertAt)n.appendChild(t);else{if("object"!=typeof e.insertAt||!e.insertAt.before)throw new Error("[Style Loader]\n\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\n Must be 'top', 'bottom', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n");var i=l(e.insertInto+" "+e.insertAt.before);n.insertBefore(t,i)}}function g(e){if(null===e.parentNode)return!1;e.parentNode.removeChild(e);var t=c.indexOf(e);t>=0&&c.splice(t,1)}function v(e){var t=document.createElement("style");return void 0===e.attrs.type&&(e.attrs.type="text/css"),_(t,e.attrs),m(e,t),t}function _(e,t){Object.keys(t).forEach((function(n){e.setAttribute(n,t[n])}))}function b(e,t){var n,r,i,o;if(t.transform&&e.css){if(!(o=t.transform(e.css)))return function(){};e.css=o}if(t.singleton){var s=p++;n=u||(u=v(t)),r=k.bind(null,n,s,!1),i=k.bind(null,n,s,!0)}else e.sourceMap&&"function"==typeof URL&&"function"==typeof URL.createObjectURL&&"function"==typeof URL.revokeObjectURL&&"function"==typeof Blob&&"function"==typeof btoa?(n=function(e){var t=document.createElement("link");return void 0===e.attrs.type&&(e.attrs.type="text/css"),e.attrs.rel="stylesheet",_(t,e.attrs),m(e,t),t}(t),r=I.bind(null,n,t),i=function(){g(n),n.href&&URL.revokeObjectURL(n.href)}):(n=v(t),r=w.bind(null,n),i=function(){g(n)});return r(e),function(t){if(t){if(t.css===e.css&&t.media===e.media&&t.sourceMap===e.sourceMap)return;r(e=t)}else i()}}e.exports=function(e,t){if("undefined"!=typeof DEBUG&&DEBUG&&"object"!=typeof document)throw new Error("The style-loader cannot be used in a non-browser environment");(t=t||{}).attrs="object"==typeof t.attrs?t.attrs:{},t.singleton||"boolean"==typeof t.singleton||(t.singleton=s()),t.insertInto||(t.insertInto="head"),t.insertAt||(t.insertAt="bottom");var n=h(e,t);return f(n,t),function(e){for(var r=[],i=0;i<n.length;i++){var s=n[i];(a=o[s.id]).refs--,r.push(a)}e&&f(h(e,t),t);for(i=0;i<r.length;i++){var a;if(0===(a=r[i]).refs){for(var l=0;l<a.parts.length;l++)a.parts[l]();delete o[a.id]}}}};var y,x=(y=[],function(e,t){return y[e]=t,y.filter(Boolean).join("\n")});function k(e,t,n,r){var i=n?"":r.css;if(e.styleSheet)e.styleSheet.cssText=x(t,i);else{var o=document.createTextNode(i),s=e.childNodes;s[t]&&e.removeChild(s[t]),s.length?e.insertBefore(o,s[t]):e.appendChild(o)}}function w(e,t){var n=t.css,r=t.media;if(r&&e.setAttribute("media",r),e.styleSheet)e.styleSheet.cssText=n;else{for(;e.firstChild;)e.removeChild(e.firstChild);e.appendChild(document.createTextNode(n))}}function I(e,t,n){var r=n.css,i=n.sourceMap,o=void 0===t.convertToAbsoluteUrls&&i;(t.convertToAbsoluteUrls||o)&&(r=d(r)),i&&(r+="\n/*# sourceMappingURL=data:application/json;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(i))))+" */");var s=new Blob([r],{type:"text/css"}),a=e.href;e.href=URL.createObjectURL(s),a&&URL.revokeObjectURL(a)}},function(e,t){e.exports=function(e){var t="undefined"!=typeof window&&window.location;if(!t)throw new Error("fixUrls requires window.location");if(!e||"string"!=typeof e)return e;var n=t.protocol+"//"+t.host,r=n+t.pathname.replace(/\/[^\/]*$/,"/");return e.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi,(function(e,t){var i,o=t.trim().replace(/^"(.*)"$/,(function(e,t){return t})).replace(/^'(.*)'$/,(function(e,t){return t}));return/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/|\s*$)/i.test(o)?e:(i=0===o.indexOf("//")?o:0===o.indexOf("/")?n+o:r+o.replace(/^\.\//,""),"url("+JSON.stringify(i)+")")}))}}]);