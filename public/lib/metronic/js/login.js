var Login = function () {
    $.fn.serializeObject = function()
    {
        var o = {};
        var a = this.serializeArray();
        $.each(a, function() {
            if (o[this.name] !== undefined) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
        return o;
    };
    return {
        //main function to initiate the module
        init: function () {

            var bg = $('<div style="background: #fff;position: fixed;z-index: -100;width: 1687px;height: 958px;"><img src="/css/bg.jpg" alt="" style="width: 1687px;height: 958px;"/></div>');
            bg.appendTo($(".login"));

            setPosition();
            function setPosition(){
                var windowWidth = window.innerWidth;
                var bgWidth =  1687;
                var left = 0;
                if(windowWidth>bgWidth){
                    left = (windowWidth - bgWidth)/2;
                }
                bg.css("left",left + "px");
                $(".content").css("left",left + 1055 + "px").css("top","200px");

            };

            $(window).resize(setPosition);

        	
           $('.login-form').validate({
	            errorElement: 'label', //default input error message container
	            errorClass: 'help-inline', // default input error message class
	            focusInvalid: false, // do not focus the last invalid input
	            rules: {
	                username: {
	                    required: true
	                },
	                password: {
	                    required: true
	                },
	                remember: {
	                    required: false
	                }
	            },

	            messages: {
	                username: {
	                    required: "请输入账号."
	                },
	                password: {
	                    required: "请输入密码."
	                }
	            },

	            invalidHandler: function (event, validator) { //display error alert on form submit   
	                $('.alert-error', $('.login-form')).show();
	            },

	            highlight: function (element) { // hightlight error inputs
	                $(element)
	                    .closest('.control-group').addClass('error'); // set error class to the control group
	            },

	            success: function (label) {
	                label.closest('.control-group').removeClass('error');
	                label.remove();
	            },

	            errorPlacement: function (error, element) {
	                error.addClass('help-small no-left-padding').insertAfter(element.closest('.input-icon'));
	            },

               submitHandler: function (form) {
                   //alert("login");
                   var regData = $(form).serializeObject();
                   $.post('/api/user/login',regData,function(data){
                       console.log(data);
                       if(!data.err && data.user){
                           var user = data.user ;
                           //alert(user.username + ",欢迎登录") ;
                           window.location = location.origin;
                       }else{
                           alert("用户名或秘密错误");
                           console.log(data);
                       }
                   });

               }
	        });

	        $('.login-form input').keypress(function (e) {
	            if (e.which == 13) {
	                if ($('.login-form').validate().form()) {
	                  //  window.location.href = "index.html";
	                }
	                return false;
	            }
	        });

	        $('.forget-form').validate({
	            errorElement: 'label', //default input error message container
	            errorClass: 'help-inline', // default input error message class
	            focusInvalid: false, // do not focus the last invalid input
	            ignore: "",
	            rules: {
	                email: {
	                    required: true,
	                    email: true
	                }
	            },

	            messages: {
	                email: {
	                    required: "邮箱尚未填写.",
                        email: "邮箱格式不正确"
	                }
	            },

	            invalidHandler: function (event, validator) { //display error alert on form submit   

	            },

	            highlight: function (element) { // hightlight error inputs
	                $(element)
	                    .closest('.control-group').addClass('error'); // set error class to the control group
	            },

	            success: function (label) {
	                label.closest('.control-group').removeClass('error');
	                label.remove();
	            },

	            errorPlacement: function (error, element) {
	                error.addClass('help-small no-left-padding').insertAfter(element.closest('.input-icon'));
	            }
	        });

	        $('.forget-form input').keypress(function (e) {
	            if (e.which == 13) {
	                if ($('.forget-form').validate().form()) {
	                   // window.location.href = "index.html";
	                }
	                return false;
	            }
	        });

	        jQuery('#forget-password').click(function () {
	            jQuery('.login-form').hide();
	            jQuery('.forget-form').show();
	        });

	        jQuery('#back-btn').click(function () {
	            jQuery('.login-form').show();
	            jQuery('.forget-form').hide();
	        });

	        $('.register-form').validate({
	            errorElement: 'label', //default input error message container
	            errorClass: 'help-inline', // default input error message class
	            focusInvalid: false, // do not focus the last invalid input
	            ignore: "",
	            rules: {
	                username: {
	                    required: true
	                },
	                password: {
	                    required: true
	                },
	                rpassword: {
	                    equalTo: "#register_password"
	                },
	                email: {
	                    required: true,
	                    email: true
	                }

	            },

	            messages: { // custom messages for radio buttons and checkboxes
                    username:{
                        required:"用户名必须填写"
                    },
                    password:{
                        required:"密码必须填写"
                    },
                    rpassword: {
                        equalTo: "两次输入的密码不一致"
                    },
                    email: {
                        required: "邮箱必须填写",
                        email: "邮箱格式不正确"
                    }
	            },

	            invalidHandler: function (event, validator) { //display error alert on form submit   

	            },

	            highlight: function (element) { // hightlight error inputs
	                $(element)
	                    .closest('.control-group').addClass('error'); // set error class to the control group
	            },

	            success: function (label) {
	                label.closest('.control-group').removeClass('error');
	                label.remove();
	            },

	            errorPlacement: function (error, element) {
	                if (element.attr("name") == "tnc") { // insert checkbox errors after the container                  
	                    error.addClass('help-small no-left-padding').insertAfter($('#register_tnc_error'));
	                } else {
	                    error.addClass('help-small no-left-padding').insertAfter(element.closest('.input-icon'));
	                }
	            },

                submitHandler: function (form) {

                    var regData = $(form).serializeObject();
                    $.post('/api/user/reg',regData,function(data){
                        console.log(data);
                        if(data.err){
                            alert("用户名或邮箱已存在！");
                        }else{
                        	window.location = location.origin;
                            /*alert(data.user.username + "你已在本站注册成功，请登录！");
                            jQuery('.login-form').show();
                            jQuery('.register-form').hide();*/
                        }
                    });

                }
	        });

	        jQuery('#register-btn').click(function () {
	            jQuery('.login-form').hide();
	            jQuery('.register-form').show();
	        });

	        jQuery('#register-back-btn').click(function () {
	            jQuery('.login-form').show();
	            jQuery('.register-form').hide();
	        });
        }

    };


}();