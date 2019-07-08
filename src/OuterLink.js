export function OuterLink(container, linkArr) {
    this.container = container;
    this.linkArr = linkArr;
}

OuterLink.prototype = {
    init() {
        $('.up_list', this.container).before('<div class="up_selector icon-plus2 glyphicon glyphicon-th"></div>');
        let outer = ''
        this.linkArr.forEach((item) => {
            outer += `
                <div class="box">
                    <img src="${item}"/>
                </div>
            `
        });
        
        this.container.append(`
            <div class="outer-links">
                <div class="boxs">
                    <div class="img-box">${outer}</div>
                </div>
            </div>
        `
        );
        this.outerBtn = $('.glyphicon-th', this.container);
        this.outerPop = $('.outer-links', this.container);
        this.imgBox = $('.img-box .box', this.outerPop);

        this.outerPop.click(() => {
            this.outerPop.fadeOut();
        });
    }
};