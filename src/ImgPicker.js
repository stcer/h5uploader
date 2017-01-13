let ImgPicker = function(container, options){
    this.opts = $.extend({
        mul : true,
        mime : 'image/*',
        type : /image.(png|jpeg|gif|jpg)/,
        maxSize : 1024 * 1024 * 16
    }, options);

    this.callback = function(file){};
    this.init(container);
};

ImgPicker.prototype = {
    init : function(container){
        let input = $('<input type="file" style="width:0; height:0;" '
            + (this.opts.mul ? 'multiple' : '')
            + ' accept="' + this.opts.mime + '">');
        container.prepend(input);

        let that = this;
        input.change(function(e){
            e = e || window.event;
            that._getFiles(e.target.files);
        });

        this.input = input;
    },

    select : function(callback){
        this.callback = callback;
        this.input.click();
    },

    _getFiles : function(files){
        let type = this.opts.type,
            size = this.opts.maxSize;
        let that = this;

        for (let i = 0,f; f = files[i]; i++) {
            if((f.type.length == 0) && (f.name.length > 0) && !(/\.(jpg|png|gif)$/.test(f.name.toLowerCase()))
                || f.type.length > 0 && !type.test(f.type.toLowerCase())
            ){
                alert('"' + f.name + '" 类型不是图片');
                continue;
            }

            if (f.size > size) {
                alert('"' + f.name + '" 大于' + size / 1024 / 1024 + 'M');
                continue;
            }
            this.callback(f);
        }
    }
};

export default ImgPicker;