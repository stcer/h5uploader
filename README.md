# Introduce

一个简单的html5图像上传组件, 仅webkit内核, 以下特性

*   小巧, css/jss压缩后小于5k
*   支持压缩质量、裁减图像尺寸后再上传
*   支持以base64或file类型上传
*   支持多图上传

# 执行流程

1.  初始化dom容器, 包括input_file, file_list
1.  ImgPicker 监听 input_file.change() 事件
1.  用户触发 input_file.click, 获得用户选择 files
1.  渲染file到DOM(file_list), imgEditor 压缩、裁剪file, 并上传
1.  执行上传过程回调(如进度处理、结果渲染)

# Example

```
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8"/>
    <title>Html5上传</title>
    <link rel="stylesheet" type="text/css" href="//cdn.bootcss.com/bootstrap/3.3.7/css/bootstrap.min.css" />
</head>
<body>
<div id="test"></div>

<script src="//cdn.bootcss.com/jquery/1.12.4/jquery.min.js"></script>
<script src="../dist/h5uploader.js"></script>
<script>
    var imgs = new H5ImgUploader('test', [], $("#test"), {
        mime : 'image/jpg',
        upload : '/upload.php'
    });
    imgs.init();
</script>

</body>
</html>
```

