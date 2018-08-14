$(function () {
    var min=rule.minOrder;
    var max=rule.maxOrder;
    var stock=$(".shopStock").val();
    var allcode = '110000';
    max=(max>stock?stock:max)>min?(max>stock?stock:max):min;
    var getType=Number($('.pgetType').val());
    //日历和数量的参数
    var data ={
        "num":[{
            "className":"number",
            "min":min,
            "max":max,
            callback:function () {
                if(getType!==1){
                    getPostage(allcode);
                }

            }
        }],
        "numMin":false,//控制数量最小是不是能传0，true为0，false为1
        "totalPrice":{
            "priceClass":"orderPrice"
        }
    }

    //省市区三级联动和邮费
    if($(".pgetType").val()==0){
        data.totalPrice.postagePrice=$("#postagePrice").text();
        getAddress('CN','province');
        getAddress(110000,'city');
        getAddress(110100,'area');
        getPostage(allcode);
        $(".paramExtension").val(110000);
        $(".paramExtensionCity").val(110100);
        $(".paramExtensionArea").val(110101);
        // getAddress('province');
        $("#province").change(function () {
            var code=$("#province option:selected").data('code');
            getAddress(code,'city');
            var area=[];
            for(var i=0;i<dataAdress.length;i++){
                if(dataAdress[i].pId==code){
                    area.push(dataAdress[i]);
                }
            }
            $(".paramExtensionCity").val(area[0].id);
            getAddress(area[0].id,'area');
            getPostage(area[0].id);
            allcode=area[0].id;
            $(".paramExtensionArea").val($("#area option").eq(0).data('code'));
        });
        $("#city").change(function () {
            var code=$("#city option:selected").data('code');
            getAddress(code,'area');
            getPostage(code);
            allcode=code;
            var area=[];
            for(var i=0;i<dataAdress.length;i++){
                if(dataAdress[i].pId==code){
                    area.push(dataAdress[i]);
                }
            }
            $(".paramExtensionCity").val(code);
            $(".paramExtensionArea").val(area[0].id);
            totalprice(data);
        });
        $("#area").change(function () {
            var code=$("#area option:selected").data('code');
            $(".paramExtensionArea").val(code);
        });
    }else{
        //自提js
        $(".add-address").click(function(){
            $(".address-layer,.mask").show();
        });
        $(".ads-tr").click(function(){
            $(this).find("input[type=radio]").attr("checked", 'checked');
            var val=$(this).find(".layer_address").text();
            $("#ipt-address").text(val);
            $(".paramExtension").val(val);
            $(".address-layer,.mask").hide();
        });
        $(".mask,.close-addlayer").click(function(){
            $(".address-layer,.mask").hide();
        });
    }
    orderInit(data);
    var validator=$("#validateForm").validate({
        rules: {
            linkMans:{
                maxlength:8,
                required:true,
                isAvailable:true,
                isKonge:true
            },
            teles: {
                isMobile: true,
                required:true
            },
            remark:{
                isAvailable:true
            },
            paramExtension:{
                isAvailable:true,
                required:true,
                isKonge:true
            }
        }
    });
    postForm('btn-sub',validator,'shop');//提交表单
    $("#select_couponCode").change(function(event) {
        changeCoupon(data);
    });
    //获取邮费
    function getPostage(code) {
        var modelCode=$(".modelCode").val();
        var amount =$("#amount").val();
        console.log({modelCode:modelCode,areaCode:code,amount:amount});
        $.post('/getPostage',{modelCode:modelCode,areaCode:code,amount:amount})
            .success(function (datas) {
                $(".postagePrice b").text(datas[0].data);
                data.totalPrice.postagePrice=datas[0].data;
                totalprice(data,'',amount);
            });
    }
});
//省市区
function getAddress(code,id) {
    var dom='';
    var province=[];
    for(var i=0;i<dataAdress.length;i++){
        if(dataAdress[i].pId==code){
            province.push(dataAdress[i]);
        }
    }
    for(var x=0;x<province.length;x++){
        dom+='<option data-code="'+province[x].id+'">'+province[x].name+'</option>';
    }
    $('#'+id).html(dom);
}

