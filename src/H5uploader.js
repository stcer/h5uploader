// main class
import ImgPicker from "./ImgPicker.js";
import ImgRender from "./ImgRender.js";
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
        width: 600,
        quality: 0.6,
        size: 1024 * 1024 * 4,

        loading: 'http://ui.jc001.cn/images/loading.gif',
        upload: '/index.php?_a=upload',
        fileName: 'media',
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

    this.imgRender = new ImgRender({
        width: this.opts.width,
        quality: this.opts.quality
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
            for (let i in this.images) {
                if (this.images[i].length == 0) {
                    continue;
                }
                let _img = currentImage = this.createImage(this.images[i]);
                _img.setValue(this.images[i]);
            }
        }

        let that = this;
        $('.up_selector', this.container).click(function () {
            let replace = that.list.find('.up_item').size() > 0 && that.opts.mul == false;
            if (replace) {
                return false;
            }

            that.imgPicker.select(function (file) {
                let img = that.createImage(that.opts.loading);
                that.render(file, img);
            });

            //
            // let img;
            // that.imgPicker.select(function(file){
            //     if(replace){
            //         img = currentImage;
            //     } else {
            //         img = currentImage = that.createImage(that.opts.loading);
            //     }
            //     that.render(file, img);
            // });
        });
    },

    _isCanAdd: function () {
        return this.list.has('.up_item').size() == 0 || this.opts.mul == true;
    },

    render: function (file, img) {
        let that = this;
        this.imgRender.getResult(file, function (dataBase64, file) {
            img.setUrl(dataBase64);
            that.upload(dataBase64, file, img);
        });
    },

    upload: function (data, file, img) {
        let progress = img.progress;

        //let prefix = 'data:' + file.type + ";base64,";
        data = data.substr(data.indexOf(',') + 1);
        let self = this;
        uploadFile(this.opts.upload, data, {
            fileName: this.opts.fileName,
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
                    alert('上传失败, 原因：' + response.message);
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
                that.render(file, img);
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