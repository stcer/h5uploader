import Img from "./Img";

export function HtmlDom(container, outerArr) {
    this.container = container;
    this.outerArr = outerArr;
}

HtmlDom.prototype = {
    init() {
        let outerArr = this.outerArr;
        let outer = '';
        outerArr.forEach((item) => {
            outer += `
            <div class="up_link-box">
                <img src="${item}"/>
            </div>
            `
        });

        this.container.addClass('h5_uploads');
        this.container.append($(`
        <div class="jH5Uploader">
            <div class="up_selector icon-plus2 glyphicon glyphicon-camera"></div>
            ${outerArr.length ? '<div class="up_links icon-plus2 glyphicon glyphicon-th"></div>' : '' }
            <div class="up_list"></div>
        </div>
        <div class="up_links-pop">
            <div class="up_link-boxs">
                <div class="up_link-imgs">${outer}</div>
            </div>
        </div>
        `
        ));
        this.itemsWrap = $('.up_list', this.container);
        this.selectorWrap = $('.up_selector', this.container);
        this.linksWrap = $('.up_links', this.container);
        this.linksImgWrap = $('.up_link-box', this.container);

        let linkPop = $('.up_links-pop', this.container);
        this.linksWrap.click(() => {
            linkPop.fadeIn();
        });
        linkPop.click(() => {
            linkPop.fadeOut();
        });
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
