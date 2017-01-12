# Introduce

一个简单的html5上传组件， 以下主要特性

*   提供压缩、裁减尺寸后以Base64方式上传，
*   支持多图上传

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

