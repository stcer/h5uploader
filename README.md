## Introduce

一个简单的html5图像上传组件, 仅webkit内核, 以下特性

*   小巧, css/jss压缩后小于5k
*   支持压缩质量、裁减图像尺寸后再上传
*   支持以base64或file类型上传
*   支持多图上传

## Example

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
    // H5ImgUploader(name, values, container, options)
    var imgs = new H5ImgUploader('test', [], $("#test"), {
        mime : 'image/jpg',
        upload : '/upload.php'
    });
    imgs.init();
</script>

</body>
</html>
```

## Options
name | type | default | description
------|-----|---------|----
mul | bool | false | 是否允许多图上传
setCoverField | bool | true | 多图上传时允许封面图像
coverFieldName | string | image | 封面图像隐藏域name
mime | string | image/* | 允许上传文件的mime类型
type | string |   | 允许上传文件的正则pattern
maxSize | int | 1024 * 1024 * 4 | 允许文件的最大尺寸(byte)
upload | string | /upload/save |  服务器上传地址
fileName | string | media | 上传文件域name
dataFormat | string | file | 文件上传格式, 可选file与base64
transData | object | {} | 上传附属数据
onUpload | function | null | 文件上传成功callback
onSend | function | null | 文件上传前callback


## 执行流程

1.  初始化dom容器, 包括input_file, file_list
1.  ImgPicker 监听 input_file.change() 事件
1.  用户触发 input_file.click, 获得用户选择 files
1.  渲染file到DOM(file_list), imgEditor 压缩、裁剪file, 并上传
1.  执行上传过程回调(如进度处理、结果渲染)