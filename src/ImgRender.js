import {isWebkit, isAndroid} from "./base.js";
import JPEGEncoder from "./JPEGEncoder.js";

let ImgRender = function(options){
    this.opts = $.extend({
        width : 500,
        quality : 0.2
    }, options);
};

ImgRender.prototype ={
    getResult : function(file, callback){
        let that = this;
        let reader = new FileReader();
        reader.onload = function(e){
            that.compress(isWebkit ? window.URL.createObjectURL(file) : this.result, file, callback);
        };
        reader.readAsDataURL(file);
    },

    compress : function(url, file, callback){
        let maxWidth = this.opts.width,
            quality = this.opts.quality;

        let img = new Image();
        img.addEventListener("load", function(){
            //生成比例
            let width = img.width,
                height = img.height,
                scale = width / height;
            if(width > maxWidth){
                width = parseInt(maxWidth);
                height = parseInt(width / scale);
            }

            // 生成canvas
            let canvas = document.createElement('canvas');
            let ctx = canvas.getContext('2d');
            canvas.width = width;
            canvas.height = height;

            ctx.drawImage(img, 0, 0, width, height);
            let base64;
            if(isAndroid){
                let tmp = ctx.getImageData(0, 0, canvas.width, canvas.height)
                quality = quality * 100;
                let encoder = new JPEGEncoder(quality);
                base64 = encoder.encode(tmp, quality);
            } else {
                base64 = canvas.toDataURL(file.type, quality);
            }
            canvas.width = 0;
            canvas.height = 0;
            canvas = null;

            callback(base64, file);
        }, false);
        img.src = url;
    }
};

export default ImgRender;