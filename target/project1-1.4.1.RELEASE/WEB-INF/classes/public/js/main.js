var activity={
  url:{
    //baoxian: 'http://huodong.tengyan.com.cn/api/customer?callback=?',
    //click: 'http://huodong.tengyan.com.cn/api/click?callback=?',
    //open: 'http://huodong.tengyan.com.cn/api/open?callback=?',
    //award: 'http://huodong.tengyan.com.cn/api/award?callback=?',
    yzmPhp: '/smsCode'
    //yzmPhp: 'http://www.mizhuokeji.com/project/smsCode'
  },
  hdID: 210,
  messageProp:{
    success: '您已成功参与中国平安的赠险活动，中国平安审核有效后会短信发送电子保单号，请注意接听中国平安工作人员后续的电话！',
    chongfu: '感谢您再次申请中国平安免费赠险。为保证您能顺利领取，请勿重复申请！'
  },
  num:0,
  init: function() {
    var _this=this;
    var month= new Date().getMonth()+1;
    var day= new Date().getDate();
    this.nowTime= new Date().getFullYear()+""+(month<10?"0"+month:month)+""+(day<10?"0"+day:day);
    this.minDay=this.nowTime-250000; //moment().subtract(28, 'days').format('YYYYMMDD');
    this.maxDay= this.nowTime-500000;
    $('.channel').val(pagekey);
    //$.getJSON(_this.url.open,{channel: pagekey,id:'210'});   
    this.bindEvent();  
      // 不同意事项不勾选的时候
      if(!$(this).is(':checked')){
        $('.submit1').button('loading');
      }else{
         $('.submit1').button('reset')
      }
  },
  bindEvent: function(){
    var _this=this;


    //神州畅行手机动态码
    $('#subyzm').on('click',function(){
      if($('#telphone').val().length==11&& !isNaN($('#telphone').val())){
//        $.getJSON(_this.url.yzmPhp,{channel: pagekey,id:_this.hdID, user_phone:$('#telphone').val(),sign:'中国平安'},
    	  $.getJSON(_this.url.yzmPhp,{user_phone:$('#telphone').val()},
          function(resJson){
    		  if(resJson.ecode==2){
    			  _this.message('提示', '请不要重复注册');
    			  return;
    		  }
            var myTimer, timing = 60;
             $.getScript("js/bootstrap.min.js",function(){
				 $('#subyzm').button('loading');
	 		});
            myTimer = setInterval(function() {
              --timing;
              $('#subyzm').text("（"+timing+"s）");
              if (timing === 0) {
                clearInterval(myTimer);
                $('#subyzm').text('发送验证码');
                $('#subyzm').button('reset');
              }
            }, 1000);
          }
        ); 
      }else{
        _this.message('提示', '请输入手机号码！');
      }
    });
    
    //$('.f-yzman1').on('click',function(){
//    	_this.message('提示', '请不要重复注册');
//      if($('#telphone').val().length==11&& !isNaN($('#telphone').val())){
////        $.getJSON(_this.url.yzmPhp,{channel: pagekey,id:_this.hdID, user_phone:$('#telphone').val(),sign:'中国平安'},
//    	  $.getJSON(_this.url.yzmPhp,{user_phone:$('#telphone').val()},
//          function(resJson){
//    		  if(resJson.ecode==2){
//    			  _this.message('提示', '请不要重复注册');
//    			  return;
//    		  }
//            var myTimer, timing = 60;
//            $('#subyzm').button('loading');
//            myTimer = setInterval(function() {
//              --timing;
//              $('#subyzm').text("（"+timing+"s）");
//              if (timing === 0) {
//                clearInterval(myTimer);
//                $('#subyzm').text('发送验证码');
//                $('#subyzm').button('reset');
//              }
//            }, 1000);
//          }
//        ); 
//      }else{
//        _this.message('提示', '请输入手机号码！');
//      }
//    });
    
    
    $('#sub').on('click',function(){
      //_this.ajaxstart(1,$('#myModal1'));
    }); 
   // $('.modalForm2 .submit2').on('click',function(){
//      _this.ajaxstart(2,$(this));
//    }); 
  },
  ajaxstart: function(id,$form){
    	var _this=this;
   	
   		$('#myModal1').validate({
      rules:{
        email: 'email',
        carnumber: 'carid',
        name: 'zhname',
        bname: 'zhname',
        carprice:{
          required:true,
          number:true
        },
        tel: {
          digits: true,
          minlength: 11,
          maxlength: 11
        },
        birth: {
          digits: true,
          minlength: 8,
          maxlength: 8,
          max: id==3?false:_this.minDay,
          min: id==3?false:_this.maxDay
        },
        city:'zhname',
      },
      messages:{
      	name: '请输入z',
        birth:{
          minlength: '请检查您的生日，格式如：19910101',
          maxlength: '请检查您的生日，格式如：19910101',
          max: '您的年龄不能小于出生28天',
          min: '您的年龄不能大于50周岁'
        },
        tel: {
          minlength: '请检查您的手机号码，重新输入',
          maxlength: '请检查您的手机号码，重新输入',
        }
      },
   	
      submitHandler: function(formevent) { 
		var flag = "0" ;
		if(!$( "#agree1" ).is(':checked')){
        		
        		 _this.message('提示','本人同意领取免费险');
        		 flag = "1";
        	}

		if(!$( "#agree2" ).is(':checked')){
        		_this.message('提示','本人同意中国平安后续致电联系确认保险产品相关事宜');
        		flag="1";
        	}
		      
        $(formevent).find('.submit'+id).button('loading');


        
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
         }).done(function(resjson){
          $(formevent).find('.submit'+id).button('reset');
          if(resjson.ecode!=4015){ //ip提交超过5次显示验证码
            $('#myModal'+id).modal('hide');
          }
          $('#myModal'+id).modal('hide');
          if(resjson.ecode==0){
            if(id==1 || id==2){              
               _this.message('参与成功!',  _this.messageProp.success);         
            }               
          }else if(resjson.ecode==2){
            _this.message('请勿重复申请！', _this.messageProp.chongfu);
          }else if(resjson.ecode==4015){ //ip提交超过5次显示验证码
            if($('.modalForm1').find('.yzm').length==0){
              $('.modalForm1').find('.m-yzmbox').before('<div class="form-group yzm"><label class="col-sm-3 control-label">验证码：</label><div class="col-sm-9 marlf-5"><img src="http://120.132.59.137:8089/api/captcha.php"><input type="text" class="form-control" name="captcha" required></div></div>');
            }else{
              $('.modalForm1').find('.yzm img').attr('src','http://120.132.59.137:8089/api/captcha.php');
            }
          }else{
            _this.message('您提交的资料有误', resjson.emsg);
          }
        });
      }
    });
  },
  message: function(title,message){
   var modalHeight=$(window).height() / 2 - $('#smallModal').height()/2 - $('#smallModal .modal-dialog').height()/2;  
    $('#smallModal .title').html(title);
    $('#smallModal .message').html(message);
    $.getScript("js/bootstrap.min.js",function(){
				 $('#smallModal').modal('show');
	 });
    
    $('#smallModal').css('margin-top', modalHeight );
  }
}
activity.init();




