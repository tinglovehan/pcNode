jQuery.validator.addMethod("isMobile", function(value, element) {
    var length = value.length;
    var mobile = /^(13[0-9]{9})|(18[0-9]{9})|(14[0-9]{9})|(17[0-9]{9})|(15[0-9]{9})$/;
    return this.optional(element) || (length == 11 && mobile.test(value));
}, "请正确填写您的手机号码");

// 身份证号码验证
jQuery.validator.addMethod("isIdCardNo", function(value, element) {
    //var idCard = /^(\d{6})()?(\d{4})(\d{2})(\d{2})(\d{3})(\w)$/;
    return this.optional(element)|| /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(value);
}, "请输入正确的身份证号码");

// 合法字符
jQuery.validator.addMethod("isAvailable", function(value, element) {
    var pattern = new RegExp("[~'!@#$%^&*()-+_=:<>]");
    return this.optional(element) || !pattern.test(value);
}, "请输入合法字符");

// 判断是否中文姓名
jQuery.validator.addMethod("isChineseName", function(value, element) {
    return this.optional(element) || (/^[\u0391-\uFFE5]+$/.test(value) && (value.length > 1 && value.length < 9));
}, "请输入正确的姓名");

// 输入空格
jQuery.validator.addMethod("isKonge", function(value, element) {
    return this.optional(element) || /^\S+$/.test(value);
}, "不允许输入空格");

//身份证验证
function isIdCardNo(num){
    //if (isNaN(num)) {alert("输入的不是数字！"); return false;}
    var len = num.length, re;
    if (len == 15)
        re = new RegExp(/^(\d{6})()?(\d{2})(\d{2})(\d{2})(\d{2})(\w)$/);
    else if (len == 18)
        re = new RegExp(/^(\d{6})()?(\d{4})(\d{2})(\d{2})(\d{3})(\w)$/);
    else {
        //alert("输入的数字位数不对。");
        return false;
    }
    var a = num.match(re);
    if (a != null)
    {
        if (len==15)
        {
            var D = new Date("19"+a[3]+"/"+a[4]+"/"+a[5]);
            var B = D.getYear()==a[3]&&(D.getMonth()+1)==a[4]&&D.getDate()==a[5];
        }
        else
        {
            var D = new Date(a[3]+"/"+a[4]+"/"+a[5]);
            var B = D.getFullYear()==a[3]&&(D.getMonth()+1)==a[4]&&D.getDate()==a[5];
        }
        if (!B) {
            //alert("输入的身份证号 "+ a[0] +" 里出生日期不对。");
            return false;
        }
    }
    if(!re.test(num)){
        //alert("身份证最后一位只能是数字和字母。");
        return false;
    }
    return true;
}
