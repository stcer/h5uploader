// main class
import ImgPicker from "./ImgPicker.js";
import imgEditor from "./ImgEditor.js";
import uploadFile from "./Uploader.js";
import {HtmlDom} from "./HtmlDom";
import {OuterLink} from "./OuterLink";

// main class
let F = function (name, images, container, options) {
    this.name = name;
    this.images = images;
    this.dom = new HtmlDom(container)

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
    
    this.link = new OuterLink(container, this.opts.outerLink);

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
        let self = this;
        let outerArr = this.opts.outerLink;
        this.dom.init()
        this.dom.getSelector().click(() => {
            this.selectFile()
        });
        this.setImages(this.images);

        if (outerArr.length) {
            this.link.init();
            let imgBox = this.link.imgBox;
            this.link.outerBtn.click(() => {
                this.link.outerPop.fadeIn();
            });
            imgBox.click(function() {
                imgBox.removeClass('cur');
                $(this).addClass('cur');
                self.setImages([outerArr[imgBox.index($(this))]]);
            });
        }
    },

    selectFile() {
        if (!this._isAbleUpload()) {
            return false;
        }

        this.imgPicker.select((file) => {
            let img = this.createImage(this.opts.loading);
            this._saveAndRender(file, img);
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
        return this.dom.getItemSize();
    },

    _isAbleUpload() {
        return this._getSize() === 0
            || this._isMulUpload() && this._getSize() < this.opts.maxItems;
    },

    _isMulUpload() {
        return this.opts.mul === true;
    },

    _isBase64() {
        return this.opts.dataFormat === 'base64';
    },

    _saveAndRender: function (file, img) {
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
        this.dom.clearItems();
        this._checkSelectorShow();
    },

    createImage: function (src, isReady) {
        if(!isReady && !this._isAbleUpload()){
            this.clear()
        }

        let img = this.dom.createImg(this.getFieldName(), src, isReady);
        img.image.click(() => {
            this.imgPicker.select((file) => {
                this._saveAndRender(file, img);
            });
        });

        img.deleteImg.click((e) => {
            e.stopPropagation();
            this._removeImg(img);
            if (this.isSetCover){
                this.dom.changeCoverImg(this.opts.coverFieldName)
            }
        });

        this._checkSelectorShow();
        return img;
    },

    _removeImg(img) {
        img.remove();
        this._checkSelectorShow();
    },

    _checkSelectorShow(){
        if (this._isAbleUpload()) {
           this.dom.selectorShow();
        } else {
            this.dom.selectorHide();
        }
    }
};

export default F;
