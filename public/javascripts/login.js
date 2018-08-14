$(function () {
    var second=60;
    //图片验证码
    imgCheck();
    $(".yzm-box em").click(function () {
        imgCheck();
    });
    //表单验证
    var validator=$("#mobileregisterform").validate({
        rules: {
            loginName:{
                required:true,
                isMobile:true
            },
            loginPass:{
                required:true,
                rangelength:[6,20]
            },
            rePassword:{
                required:true,
                equalTo:"#loginPass"
            }
            // checkCode:{
            //     required:true
            // }
        }
    });
    var validatorlogin=$("#mobileloginform").validate({
        rules: {
            loginName:{
                required:true,
                isMobile:true
            },
            loginPass:{
                required:true,
                rangelength:[6,20]
            },
            checkcode:{
                required:true
            }
        }
    });
    document.onkeydown = function(e){
        var ev = document.all ? window.event : e;
        if(ev.keyCode==13) {
            if($("#mobileregisterform").length>0){
                registerClick();
            }else{
                if($('.form-login').eq(0).hasClass('slt')){
                    loginClick();
                }else{
                    telLoginFun()
                }
            }

        }
    }
    $("#login").click(function () {
        loginClick()
    });
    function loginClick() {
        if(validatorlogin.form()){
            $.get('/leaguerLogin?' + $('#mobileloginform').serialize())
                .success(function (data){
                    console.log(data);
                    var datas = data[0];
                    if (datas.status === 200){
                        if(datas.curUrl){
                            window.location.href = datas.curUrl;
                        }else{
                            window.location.href = '/';
                        }
                        // window.location.href = '/';
                    }else{
                        imgCheck();
                        dilogbox(datas.status,datas.message)
                    }
                })
                .error(function (err){
                    window.location.href = '/error';
                });
        }
    }
    //注册按钮点击
    $("#register").click(function(){
        registerClick()
    });
    function registerClick() {
        if(validator.form()){
            var loginName=$("#loginNameMobileRan").val();
            var loginPass=$("#loginPass").val();
            var checkCode=$("#checkCodePmMobile").val();
            var url='/signIn?loginName='+loginName+'&loginPass='+loginPass+'&checkCode='+checkCode;
            $.ajax({
                url:url,
                type:'GET',
                success:function (data) {
                    if(data[0].status==200){
                        dilogbox(data[0].status,'注册成功','/')
                    }else{
                        dilogbox(data[0].status,data[0].message,'/')
                    }
                    // if(data[0].status==200){
                    //     window.location.href='/login';
                    // }
                }
            })
        }
    }
    //点击发送验证码按钮
    var validatorCheck1=$("#mobileregisterform").validate({
        rules: {
            loginName: {
                required: true,
                isMobile: true
            }
        }
    });
    $(".btn-dcode").click(function () {
            var loginName=$("#loginNameMobileRan").val();
            $.post('/checkCode',{mobile:loginName,sendType:'pcReg'})
                .success(function (data) {
                    // dilogbox(data[0].status,data[0].message,'javascript:;');
                    if(data[0].status=='200'){
                        waitTime(document.getElementById('btn-dcode'));
                    }else{
                        dilogbox(data[0].status,data[0].message,'javascript:;');
                    }
                })

            // .error(function(data){
            //     dilogbox(data[0].status,data[0].message,'javascript:;');
            // })
    });
    function waitTime(obj){
        if (second === 0){
            obj.removeAttribute('disabled');
            obj.value = '获取动态码';
            second = 60;
        }else{
            obj.setAttribute('disabled',true);
            obj.value = '重新发送(' + second + ')';
            second -= 1;
            setTimeout(function (){
                waitTime(obj);
            },1000);
        }
    }

    $(".yzm-btn").click(function () {
        var form = {
            mobile:$("#loginName1").val(),
            sendType:'pcLogin'
        }
        $.post('/checkCode',form)
            .success(function (data) {
                // dilogbox(data[0].status,data[0].message,'javascript:;');
                if(data[0].status=='200'){
                    waitTime(document.getElementById('yzm-text'));
                }else{
                    dilogbox(data[0].status,data[0].message,'javascript:;');
                }
            })
    });
    //手机快捷登录
    var telLogin=$("#mobileform").validate({
        rules: {
            mobile:{
                required:true,
                isMobile:true
            },
            checkCode:{
                required:true
            },
            code:{
                required:true
            }
        }
    });
    $("#telLogin").click(function () {
        telLoginFun()
    });
    function telLoginFun() {
        if(telLogin.form()){
            $.get('/leaguerMobileLogin?channel=LOTSPC&' + $('#mobileform').serialize())
                .success(function (data){
                    console.log(data);
                    var datas = data[0];
                    if (datas.status === 200){
                        if(datas.curUrl){
                            window.location.href = datas.curUrl;
                        }else{
                            window.location.href = '/';
                        }
                        // window.location.href = '/';
                    }else{
                        imgCheck();
                        dilogbox(datas.status,datas.message)
                    }
                })
                .error(function (err){
                    window.location.href = '/error';
                });
        }
    }
})
function imgCheck() {
    $.post('/captchap')
        .success(function (data) {
            $(".yzm-box img").attr('src','data:image/jpg;base64,'+data);
        });
}