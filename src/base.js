let isWebkit = (function() {
    let ua = navigator.userAgent.toLowerCase();
    let r = /webkit/;
    return r.test(ua);
})();

let isAndroid = (function() {
    let ua = navigator.userAgent.toLowerCase();
    let r = /android/;
    return r.test(ua);
})();

export {
    isWebkit, isAndroid
}