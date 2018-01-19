// (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
//   (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
//   m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
//   })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

//   ga('create', 'UA-65908006-1', 'auto');
//   ga('send', 'pageview');
(function($){
  if($.validator){
    $.validator.setDefaults({
      errorElement: "span",
      errorClass: "help-block",
      highlight: function (element, errorClass, validClass) {
        $(element).closest('.form-group').addClass('has-error');
      },
      unhighlight: function (element, errorClass, validClass) {
        $(element).closest('.form-group').removeClass('has-error');
      },
      errorPlacement: function (error, element) {
        if(element.parent('.input-group').length || element.prop('type') === 'checkbox' || element.prop('type') === 'radio') {
          error.insertBefore(element.parent());
        }else{
          error.insertAfter(element);
        }
      }
    });
    $.validator.addMethod("carid", function(value, element) {
      return this.optional(element) || /^[\u4e00-\u9fa5]{1}[A-Za-z]{1}[A-Za-z_0-9]{5}$/.test(value);
    }, "请检查您的车牌号，格式如：京A12345");
    $.validator.addMethod("zhname", function(value, element) {
      return this.optional(element) || /^[\u2E80-\uFE4F]+$/.test(value);
    }, "请输入您的中文");
    // 身份证号码验证
    $.validator.addMethod("idcard", function(value, element) {
      return this.optional(element) || /^[0-9]{17}([0-9]|x)$/.test(value);
    }, "身份证号用于领取保障，请正确填写！");
    // 手机验证
    $.validator.addMethod("phone", function(value, element) {
      return this.optional(element) || /^(13[0-9]|14[0-9]|15[0-9]|18[0-9]|17[0-9])[0-9]{8}$/.test(value);
    }, "请输入正确的手机号码");
  }
})(jQuery);

$.fn.serializeJson=function(){
  var serializeObj={};
  var array=this.serializeArray();
  var str=this.serialize();
  $(array).each(function(){
      if(serializeObj[this.name]){
          if($.isArray(serializeObj[this.name])){
              serializeObj[this.name].push(this.value);
          }else{
              serializeObj[this.name]=[serializeObj[this.name],this.value];
          }
      }else{
          serializeObj[this.name]=this.value;
      }
  });
  return serializeObj;
};
//渠道
var pagekey="";
var mi_source="";
var utm_source="";
var email= GetQueryString("email") || "";
function GetQueryString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]); return null;
}

if(GetQueryString("utm_source")){
  pagekey= GetQueryString("utm_source");
}else if(GetQueryString("channel")){
  pagekey= GetQueryString("channel");
}else{
  pagekey= 'wangyi';
}
if(GetQueryString("mi_source")){
  mi_source= GetQueryString("mi_source");
}
if(GetQueryString(";mi_source")){
  mi_source= GetQueryString(";mi_source");
}
