export default function (url, image, options) {
    let xhr = new XMLHttpRequest();
    if (!xhr.upload) {
        return false;
    }

    let opts = $.extend({
        method: "POST",
        fileName: "media",
        transData: {},
        onInit: function () {
        },
        onProgress: function (loaded, total) {
        },
        onError: function (xhr) {
        },
        onSuccess: function (xhr) {
        },
        onSend: function (formData) {
        }
    }, options);

    // trigger event init
    opts.onInit();

    xhr.upload.addEventListener("progress",
        function (e) {
            if (e.lengthComputable) {
                // trigger event
                opts.onProgress(e.loaded, e.total);
            }
        }, false
    );

    // 文件上传成功或是失败
    xhr.onReadyStateChange = function (e) {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                // trigger event success
                opts.onSuccess(xhr);
            } else {
                // trigger event error
                opts.onError(xhr);
            }
        }
    };

    // 开始上传
    xhr.open(opts.method, url, true);

    let formData = new FormData();
    formData.append(opts.fileName, image);
    formData.append('format', 'base64');
    for (let prop in opts.transData) {
        if (opts.transData.hasOwnProperty(prop)) {
            formData.append(prop, opts.transData[prop]);
        }
    }

    // trigger event
    opts.onSend(formData);
    xhr.send(formData);
    return true;
};