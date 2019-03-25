// (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
//   (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
//   m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
//   })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

//   ga('create', 'UA-65908006-1', 'auto');
//   ga('send', 'pageview');
(function($){
  //$('#myModal1').validate();
  if($.validator){
    $.validator.setDefaults({
      errorElement: "span",
      errorClass: "help-block",
     // highlight: function (element, errorClass, validClass) {
//        $(element).closest('.ryui-box-flex-1').addClass('has-error');
//      },
//      unhighlight: function (element, errorClass, validClass) {
//        $(element).closest('.ryui-box-flex-1').removeClass('has-error');
//      },
      errorPlacement: function (error, element) {
        //if(element.parent('.input-group').length || element.prop('type') === 'checkbox' || element.prop('type') === 'radio') {
//          error.insertBefore(element.parent());
//        }else{
//          error.insertAfter(element);
//        }
		$( element ).val(($(error).text()));
		
		//error.insertAfter(element);
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


$( "#dialog" ).click(function() {
        	  $( "#page1" ).show( "fold", 200 );
        	  $( "#page1-mask" ).show( "fold", 200 );
        	  
        });
        
        $( "#page1close" ).click(function() {
      	  $( "#page1" ).hide();
      	  $( "#page1-mask" ).hide();
      	  
      	});
        
$( "#open" ).click(function() {
			var p = $(this).offset(); 
      	  $( "#anquan" ).show( "fold", 200 ).css({ 
	        left:p.left-15,
	        top:p.top+30
	    });
      	  //$( "#page1-mask" ).show( "fold", 200 );
      });
      
$( "#anquanclose" ).click(function() {
    	  $( "#anquan" ).hide();
    	  //$( "#page1-mask" ).hide();
    	  
    	});
      	
 $( "#sex1" ).click(function() {
        	$( "#sexman" ).removeClass("man");
      	  $( "#sexman" ).addClass("man_click");
      	$( "#sexwoman" ).removeClass("man_click");
      	$( "#sexwoman" ).addClass("man");
      	$( "#sex" ).val("1");
      	});
        
        $( "#sex2" ).click(function() {
        	$( "#sexwoman" ).removeClass("man");
        	  $( "#sexwoman" ).addClass("man_click");
        	$( "#sexman" ).removeClass("man_click");
        	$( "#sexman" ).addClass("man");
        	$( "#sex" ).val("2");
        });


  
  $( "#username" ).focus(function() {
        	  myfocus($( "#username" ));
        	});
   
   $( "#username" ).blur(function() {
   			myblur($( "#username" ));
    });
    $( "#telphone" ).focus(function() {
      	  myfocus($( "#telphone" ));
      	  
      	});
        $( "#telphone" ).blur(function() {
      	 myblur($( "#telphone" ));
      	  
      	});
      	
       $( "#bday" ).focus(function() {
        	 myfocus($( "#bday" ));
        	});
        $( "#bday" ).blur(function() {
        	 myblur($( "#bday" ));
        	});
        
        $( "#yzm" ).focus(function() {
        	  myfocus($( "#yzm" ));
        	});
       $( "#yzm" ).blur(function() {
        	 myblur($( "#yzm" ));
        	});

//animate1 = $.getScript("/js/jquery-ui.min.js",function(){
//			  animate({backgroundColor: "#aa0000",
//			        	          //color: "#fff",
//			        	          //width: 500
//			        	        }, 1000 );
//  			});

$("#sub").click(function(){
        	var flag = "0";
        	if($( "#username" ).val()=='' ){
		     asdf($( "#username" ));
        	 flag="1";
        	} 
        	
        	if(flag!="1" && !isChn($( "#username" ).val())){
        	 asdf($( "#username" ),'请输入您的中文名字');
        	 flag="1";
        	}
        	
			if($( "#telphone" ).val()=='' || !isPhoneNo($( "#telphone" ).val())){
			
					//$.getScript("/js/jquery-ui.min.js",function(){
				asdf($( "#telphone" ),'请输入正确的手机号');
	  			flag="1";
        		
        	}
			
			if($( "#bday" ).val()==''|| $( "#bday" ).val().length != 8){
				//$.getScript("/js/jquery-ui.min.js",function(){
				 asdf($( "#bday" ));
        		flag="1";
        	}
        	
        	if(flag!="1" && ( ages($( "#bday" ).val())>50 || ages($( "#bday" ).val())<1)){
        		 asdf($( "#bday" ),'您的年龄必须在1到50岁之间');
        		 flag="1";
        	}
        	
			
			if($( "#yzm" ).val()==''){
				//$.getScript("/js/jquery-ui.min.js",function(){
				 asdf($( "#yzm" ),'请输入验证码');
        		flag="1";
        	}
			
			
        	
        	if(flag=='1'){
        		return;
        	}
        	
			//if(!$( "#agree1" ).is(':checked')){
//        		
//        		//alert("请勾选 同意中国平安致电确认免费保险生效事宜");
//        		flag="1";
//        	}
        	
        	if(!$( "#agree2" ).is(':checked')){
        		
        		//alert("请勾选 同意中国平安致电确认免费保险生效事宜");
        		flag="1";
        	}
			
			if(flag=='1'){
				message('提示','请勾 本人同意领取免费险，本人同意中国平安后续致电联系确认保险产品相关事宜')
        		return;
        	}
        	
            //Ajax调用处理
          $.ajax({
             type: "POST",
             url: "save",
           	 data: {
                 "username": $("#username").val(),
                 "sex": $("#sex").val(),
                 "telphone": $("#telphone").val(),
                 "bday":$("#bday").val(),
                 "email":$("#yzm").val()
             },
             success: function(data){
             if(data.ecode==0){
             	message('参与成功','恭喜您参与成功，中国平安工作人员后续将致电您关于保险生效事宜，谢谢您的参与！')
             } else if(data.ecode==2){
             	message('请勿重复申请！','')
             } else if(data.ecode==3){
             	message('验证码出错！','请确认以后重新输入')
             } else if(data.ecode==4){
             	message('验证码超时！','请重新获取')
             }
            	 //$( "#page2" ).show( "fold", 200 );
//            	 $( "#page2-mask" ).show( "fold", 200 );
            	 
                }
          });
          
           $( "#page2close" ).click(function() {
        	$( "#page2" ).hide();
        	$( "#page2-mask" ).hide();
        	window.location.reload()
        });
})

function asdf(element,value){
	
	 $( element ).animate(
	 	{backgroundColor: "#00BFFF",}, 1000 
	 );
	$( element ).val('');
	if(value){
		$( element ).attr('placeholder',value);
	}
	$( element ).animate(
		{backgroundColor: "#fffff",}
	, 500 )

}

function myfocus(element){
        	  $(element).css('color','black');
}

function myblur(element){
	if($(element).val()!=''){
		
	} else{
		$( "element" ).css('color','#cccccc');
	}
	
        	 // $(element).css('color','black');
}


 function isPhoneNo(phone) { 
    	 var pattern = /^1[34578]\d{9}$/; 
    	 return pattern.test(phone); 
}

function isChn(str){ 
	var reg = /^[\u4E00-\u9FA5]+$/; 
	if(!reg.test(str)){ 
	//alert("不是中文"); 
		return false; 
	} else {
		return true;
	}
} 


function   ages(str)   
 {   
        var   r   =   str.match(/^(\d{1,4})(\d{1,2})(\d{1,2})$/);     
        if(r==null)return   false;     
        //var   d=   new   Date(r[2],   r[3],   r[4]);     
        var date = new Date();
 		var year = date.getFullYear(); 
       	return year - r[1];
       // return("输入的日期格式错误！");   
 }   
 
 
function  message(title,message){
   var modalHeight=$(window).height() / 2 - $('#smallModal').height()/2 - $('#smallModal .modal-dialog').height()/2;  
    $('#smallModal .title').html(title);
    $('#smallModal .message').html(message);
    $.getScript("js/bootstrap.min.js",function(){
				 $('#smallModal').modal('show');
	 });
    
    $('#smallModal').css('margin-top', modalHeight );
  }
