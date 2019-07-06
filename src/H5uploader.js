// main class
import ImgPicker from "./ImgPicker.js";
import imgEditor from "./ImgEditor.js";
import uploadFile from "./Uploader.js";
import Img from "./Img.js";

// main class
let F = function (name, images, container, options) {
    this.name = name;
    this.images = images;
    this.container = container;
    this.itemsWrap = null;
    this.selectorWrap = null;
    this.outerWrap = null;

    this.opts = $.extend({
        mul: false,
        setCoverField: false,
        coverFieldName: 'image',

        // render
        mime: 'image/*',
        type: /image.(png|jpeg|gif|jpg)/,
        maxSize: 1024 * 1024 * 4,
        maxItems: 12,

        // _upload
        loading: 'http://ui.jc001.cn/images/loading.gif',
        upload: '/upload/save',
        fileName: 'media',
        dataFormat : 'file',
        transData: {},
        outerLink: [],

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
        let outerArr = this.opts.outerLink;
        let self = this;
        let outer = '';
        outerArr.forEach((item, index) => {
            outer += `
                <div class="box" data="${index}">
                    <img src="${item}"/>
                </div>
            `
        });

        this.container.addClass('h5_uploads');
        this.container.append($(`
            <div class="jH5Uploader">
                <div class="up_selector icon-plus2 glyphicon glyphicon-camera"></div>
                ${outer ? '<div class="up_selector icon-plus2 glyphicon glyphicon-th"></div>' : ''}
                <div class="up_list"></div>
            </div>
            <div class="outer-links">
                <div class="boxs">
                    <div class="img-box">
                        ${outer}
                    </div>
                </div>
            </div>
            `
        ));
        this.itemsWrap = $('.up_list', this.container);
        this.selectorWrap = $('.glyphicon-camera', this.container);
        this.outerWrap = $('.glyphicon-th', this.container);
        this.selectorWrap.click(() => {
            this.selectFile()
        });
        this.outerWrap.click(() => {
            this.outerFile()
        });
        $('.outer-links', this.container).click(() => {
            this.outerFile(1)
        });
        $('.outer-links .box', this.container).click(function() {
            let links = $('.outer-links .box', this.container);
            links.removeClass('cur');
            $(this).addClass('cur');
            self.setImages([outerArr[links.index($(this))]]);
        });

        this.setImages(this.images);
    },

    outerFile(out) {
        $('.outer-links', this.container)[out ? 'fadeOut' : 'fadeIn']();
    },

    selectFile() {
        if (!this._isAbleUpload()) {
            return false;
        }

        this.imgPicker.select((file) => {
            let img = this.createImage(this.opts.loading, true);
            this._render(file, img);
        });
    },

    setImages(images) {
        this.clear();

        if(!images) {
            return;
        }

        images.forEach((src) => {
            if(src.length === 0){
                return;
            }
            this.createImage(src).setValue(src);
        });
    },

    _getSize() {
        return this.itemsWrap.find('.up_item').size();
    },

    _isAbleUpload() {
        return this._isEmpty()
            || this._isMulUpload() && this._getSize() < this.opts.maxItems;
    },

    _isMulUpload() {
        return this.opts.mul === true;
    },

    _isBase64() {
        return this.opts.dataFormat === 'base64';
    },

    _isEmpty() {
        return this._getSize() === 0;
    },

    _render: function (file, img) {
        if((this.opts.maxWidth || this.opts.opacity)){
            this.imgEditor.getResult(file,  (fileData, file) => {
                img.setUrl(this._isBase64()
                    ? fileData
                    : URL.createObjectURL(fileData)
                );
                this._upload(fileData, file, img);
            });
        } else {
            img.setUrl(URL.createObjectURL(file));
            this._upload(file, file, img);
        }
    },


    _upload: function (data, file, img) {
        let self = this;
        let progress = img.progress;
        //let prefix = 'data:' + file.type + ";base64,";
        data = this._isBase64() ? data.substr(data.indexOf(',') + 1)  : data;

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

            onSuccess: (xhr) => {
                console.log(xhr.responseText);
                let response = eval("(" + xhr.responseText + ")");
                if (response.code === 200) {
                    progress.val(100);
                    progress.hide();
                    img.setValue(response.data.url);
                    self.opts.onUpload(response.data.url);
                } else {
                    alert('上传失败, ' + response.message);
                    this._removeImg(img);
                }
            },

            onError: (xhr) => {
                alert('上传失败(' + xhr.status + ')');
                this._removeImg(img);
            } ,

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

    clear: function(){
        this.itemsWrap.html('');
        this._checkSelectorShow();
    },

    createImage: function (src, isReady) {
        if(!isReady && !this._isAbleUpload()){
            this.clear()
        }

        let img = new Img(this.getFieldName(), src, this.itemsWrap, isReady);
        img.image.click(() => {
            this.imgPicker.select((file) => {
                this._render(file, img);
            });
        });

        img.deleteImg.click((e) => {
            e.stopPropagation();
            this._removeImg(img);
            if (this.isSetCover
                && $(`input[name=${this.opts.coverFieldName}]`, this.itemsWrap).size() === 0)
            {
                let item = $('>:first-child', this.itemsWrap);
                $('input[type=hidden]', item).attr('name', this.opts.coverFieldName);
            }
        });

        if(this._isAbleUpload()){
            this.selectorWrap.hide();
        }

        this._checkSelectorShow();
        return img;
    },

    _removeImg(img) {
        img.remove();
        this._checkSelectorShow();
    },

    _checkSelectorShow(){
        if (this._isAbleUpload()) {
           this.selectorWrap.show();
        } else {
            this.selectorWrap.hide();
        }
    }
};

export default F;
