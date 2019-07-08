import Img from "./Img";

export function HtmlDom(container) {
    this.container = container;
}

HtmlDom.prototype = {
    init() {
        this.container.addClass('h5_uploads');
        this.container.append($(`
<div class="jH5Uploader">
<div class="up_selector icon-plus2 glyphicon glyphicon-camera"></div>
<div class="up_list"></div>
</div>
`
        ));
        this.itemsWrap = $('.up_list', this.container);
        this.selectorWrap = $('.glyphicon-camera', this.container);
    },

    getItems() {
        return this.itemsWrap;
    },

    getSelector(){
        return this.selectorWrap;
    },

    selectorShow() {
      this.selectorWrap.show();
    },

    selectorHide() {
        this.selectorWrap.hide();
    },

    getItemSize() {
        return this.itemsWrap.find('.up_item').size();
    },

    clearItems(){
        this.itemsWrap.html('');
    },

    createImg(filedName, src, isReady) {
        return new Img(filedName, src, this.itemsWrap, isReady);
    },

    changeCoverImg(coverFieldName){
        if($(`input[name=${coverFieldName}]`, this.itemsWrap).size() === 0) {
            let item = $('>:first-child', this.itemsWrap);
            $('input[type=hidden]', item).attr('name', coverFieldName);
        }
    }
};
