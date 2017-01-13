// main class
import ImgPicker from "./ImgPicker.js";
import imgEditor from "./ImgEditor.js";
import uploadFile from "./Uploader.js";
import Img from "./Img.js";

// main class
let F = function (name, images, container, options) {
    this.name = name;
    this.images = images;
    this.curtImg = null;
    this.list = null;
    this.container = container;

    this.opts = $.extend({
        mul: false,
        setCoverField: true,
        coverFieldName: 'image',

        // render
        mime: 'image/*',
        type: /image.(png|jpeg|gif|jpg)/,
        maxSize: 1024 * 1024 * 4,

        // _upload
        loading: 'http://ui.jc001.cn/images/loading.gif',
        upload: '/upload/save',
        fileName: 'media',
        dataFormat : 'file',
        transData: {},
        onUpload: function (src) {
        },
        onSend: function (F) {
        }
    }, options);

    this.isSetCover = false;

    this.imgPicker = new ImgPicker(container, {
        mul: this.opts.mul,
        mime : this.opts.mime
    });

    this.imgEditor = new imgEditor({
        maxWidth: this.opts.maxWidth,
        quality: this.opts.quality,
        dataFormat : this.opts.dataFormat
    });
};

F.prototype = {
    init: function () {
        this.container.addClass('h5_uploads');
        this.container.append($('' +
            '<div class="up_selector icon-plus2 glyphicon glyphicon-camera"></div>' +
            '<div class="up_list"></div>' +
            ''));
        this.list = $('.up_list', this.container);

        let currentImage = false;
        if (this.images) {
            this.images.forEach(function(src){
                if(src.length == 0){
                    return;
                }
                let _img = currentImage = this.createImage(src);
                _img.setValue(src);
            });
        }

        let that = this;
        $('.up_selector', this.container).click(function () {
            let replace = that.list.find('.up_item').size() > 0 && that.opts.mul == false;
            if (replace) {
                return false;
            }

            that.imgPicker.select(function (file) {
                let img = that.createImage(that.opts.loading);
                that._render(file, img);
            });
        });
    },

    _isCanAdd: function () {
        return this.list.has('.up_item').size() == 0 || this.opts.mul == true;
    },

    _render: function (file, img) {
        let that = this;
        if((this.opts.maxWidth || this.opts.opacity)){
            this.imgEditor.getResult(file, function (fileData, file) {
                img.setUrl(that.opts.dataFormat == 'base64'? fileData : URL.createObjectURL(fileData));
                that._upload(fileData, file, img);
            });
        } else {
            img.setUrl(URL.createObjectURL(file));
            that._upload(file, file, img);
        }
    },

    _upload: function (data, file, img) {
        let self = this;
        let progress = img.progress;
        //let prefix = 'data:' + file.type + ";base64,";
        data = this.opts.dataFormat == 'base64d' ? data.substr(data.indexOf(',') + 1)  : data;

        uploadFile(this.opts.upload, data, {
            fieldName : this.opts.fileName,
            fileName: file.name,
            format : self.opts.dataFormat,
            transData: self.opts.transData,

            onInit: function () {
                progress.show();
                progress.val(0);
            },

            onProgress: function (loaded, total) {
                progress.val((loaded / total) * 100);
            },

            onSuccess: function (xhr) {
                let response = eval("(" + xhr.responseText + ")");
                if (response.code == 200) {
                    progress.val(100);
                    progress.hide();
                    img.setValue(response.data.url);
                    self.opts.onUpload(response.data.url);
                } else {
                    alert('上传失败, ' + response.message);
                    img.remove();
                }
            },

            onError: function (xhr) {
                alert('上传失败(' + xhr.status + ')');
                img.remove();
            },

            onSend: function (formData) {
                self.opts.onSend(formData);
            }
        });
    },

    getFieldName: function () {
        if (this.opts.mul
            && this.opts.setCoverField
            && !this.isSetCover) {
            this.isSetCover = true;
            return this.opts.coverFieldName;
        }
        return this.opts.mul ? this.name + '[]' : this.name;
    },

    createImage: function (src) {
        let that = this;
        let name = this.getFieldName();
        let img = new Img(name, src, this.list);

        img.image.click(function () {
            that.imgPicker.select(function (file) {
                that._render(file, img);
            });
        });

        img.deleteImg.click(function () {
            img.remove();
            if (that.isSetCover
                && $('input[name=' + that.opts.coverFieldName + ']', that.list).size() == 0) {
                let item = $('>:first-child', that.list);
                $('input[type=hidden]', item).attr('name', that.opts.coverFieldName);
            }
            event.stopPropagation();
        });
        return img;
    }
};

export default F;
