$(function () {
    var second=60;
    var leaguerId='';
    var validatorCheck=$("#forgetform").validate({
        rules: {
            loginName: {
                required: true,
                isMobile: true
            }
            // code:{
            //     required:true
            // }
        }
    });
    var validatorlogin=$("#forgetform").validate({
        rules: {
            loginName:{
                required:true,
                isMobile:true
            },
            checkcode:{
                required:true
            },
            code:{
                required:true
            }
        }
    });
    var forget2form=$("#forget2form").validate({
        rules: {
            password: {
                required: true,
                rangelength:[6,20]
            },
            passwordTo: {
                required: true,
                equalTo: "#password"
            }
        }
    });
    imgCheck();
    $(".img-check img").click(function () {
        imgCheck();
    });

    //点击发送验证码按钮
    $(".btn-dcode").click(function () {
        if(validatorCheck.form()){
            var loginName=$("#loginNameMobileRan").val();
            $.post('/checkCode',{mobile:loginName,sendType:'pwd',imgCode:true,code:$('.code').val()})
                .success(function (data) {
                    console.log(data)
                    if(data[0].status=='200'){
                        waitTime(document.getElementById('btn-dcode'));
                    }else{
                        dilogbox(data[0].status,data[0].message);
                        imgCheck();
                    }
                })
        }
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

    //下一步按钮点击
    $("#btn1").click(function () {
        if(validatorlogin.form()){
            $.post('/checkphone', $('#forgetform').serialize())
                .success(function (data) {
                    console.log(data);
                    if (data[0].status == '200'){
                        leaguerId=data[0].data.id;
                        $(".box2").show();
                        $(".box1").hide();
                    }else{
                        dilogbox(data[0].status,data[0].message);
                        imgCheck();
                    }
                })
        }
    });
    $("#btn2").click(function () {
        if(forget2form.form()){
            $.post('/changePassWord',{password:$("#password").val(),leaguerId:leaguerId})
                .success(function (data) {
                    dilogbox(data[0].status,data[0].message,'/login')
                })
        }
    })

});
function imgCheck() {
    $.post('/captchap')
        .success(function (data) {
            $(".img-check img").attr('src','data:image/jpg;base64,'+data);
        });
}