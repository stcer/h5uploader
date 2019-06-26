let Img = function(name, url, container, isReady){
    let item = $(`
<div class="up_item">
    <input type="hidden" name="${name}" />
    <img src="${url}" />
    <progress max="100" value="0"></progress>
    <a name="none" style="" class="up_close">×</a>
</div>
`
    );
    container.append(item);

    this.root = item;
    this.isReady = isReady;
    this.deleteImg = $('a', item);
    this.progress = $('progress', item);
    this.image = $('img', item);
    this.value = $('input', item);
};

Img.prototype = {
    setUrl : function(url){
        this.image.attr('src', url);
    },

    setValue : function(value){
        this.value.val(value);
    },

    remove : function(){
        this.root.remove();
    }
};

export default Img;
