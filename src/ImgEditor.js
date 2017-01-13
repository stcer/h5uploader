
let ImgEditor = function(options){
    this.opts = $.extend({
        maxWidth : 0,
        quality : 0.7,
        dataFormat : 'base64'
    }, options);
};

ImgEditor.prototype ={
    getResult : function(file, callback){
        let that = this;
        let maxWidth = parseInt(this.opts.maxWidth),
            quality = parseFloat(this.opts.quality);
        let url = URL.createObjectURL(file);
        if(quality == 0.0){
            quality = 1;
        }

        //压缩质量与裁剪宽度
        let img = new Image();
        img.addEventListener("load", function(){
            //生成比例
            let width = img.width,
                height = img.height,
                scale = width / height;
            if(maxWidth > 0 && width > maxWidth){
                width = maxWidth;
                height = parseInt(width / scale);
            }

            // 生成canvas
            let canvas = document.createElement('canvas');
            let ctx = canvas.getContext('2d');
            canvas.width = width;
            canvas.height = height;

            ctx.drawImage(img, 0, 0, width, height);

            // 释放对象
            URL.revokeObjectURL(url);

            if(that.opts.dataFormat  == 'base64'){
                let data = canvas.toDataURL(file.type, quality);
                canvas.width = 0; canvas.height = 0;
                canvas = null;
                callback(data, file);
            } else {
                canvas.toBlob(function(data){
                    callback(data, file);
                }, file.type, quality);
            }
        }, false);

        img.src = url;
    }
};

export default ImgEditor;