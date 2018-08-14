(function($){
    $.fn.calendar = function (method) {
        // 如果第一个参数是字符串, 就查找是否存在该方法, 找到就调用; 如果是object对象, 就调用init方法;.
        if (methods[method]) {
            // 如果存在该方法就调用该方法
            // apply 是吧 obj.method(arg1, arg2, arg3) 转换成 method(obj, [arg1, arg2, arg3]) 的过程.
            // Array.prototype.slice.call(arguments, 1) 是把方法的参数转换成数组.
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            // 如果传进来的参数是"{...}", 就认为是初始化操作.
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.calendar');
        }
    };

    // 不把方法扩展在 $.fn.calendar 上. 在闭包内建个"methods"来保存方法, 类似共有方法.
    var methods = {
        /**
         * 初始化方法
         * @param _options
         * @return {*}
         */
        init : function (_options) {
            return this.each(function () {
                var $this = $(this);
                var opts = $.extend({}, $.fn.calendar.defaults, _options);
                var multiselectflag=0;
                var sd=opts.selecteday.split("-");
                    myyear = sd[0],
                    mymonth = sd[1].replace(/\b(0+)/gi,"")-1;
                $this.addClass("calendar-panel").width(opts.width);
                calendar.makecalendar($this,opts);
                $this.off("click");
                $this.on("click","td:not(.other,.prevM,.nextM)", function() {
                    var flagM=$(this).attr("data"),myyear=$(this).parent().parent().parent().data("year"),mymonth=$(this).parent().parent().parent().data("month");
                    var day=$(this).find(".date-title").text()=="今天"?mydate.getDate():$(this).find(".date-title").text();
                    var date=myyear+"-"+private_methods.p(mymonth+1)+"-"+private_methods.p(day); //当前年月日
                    var price=$(this).find(".calendar-explian").find(".price").find("strong").text();
                    var ticket=$(this).find(".price").data("ticket");
                    var methods_date=private_methods.p(day);//当前日
                    switch (flagM){
                        case "prevM":
                            if(mymonth==0){
                                date=(parseFloat(myyear)-1)+"-12-"+private_methods.p(day);
                            }
                            else{
                                date=myyear+"-"+p(mymonth)+"-"+private_methods.p(day);
                            }
                            break;
                        case "nextM":
                            if(mymonth+2>12){
                                date=(parseFloat(myyear)+1)+"-01-"+private_methods.p(day);
                            }
                            else{
                                date=myyear+"-"+private_methods.p(parseFloat(mymonth)+2)+"-"+private_methods.p(day);
                            }
                            break;
                    }
                    if(opts.multiselect){
                        var selecteddates=$this.find("td.selected");
                        if(selecteddates.length==2){
                            selecteddates.removeClass('selected').removeData("selected").find(".timeslot").remove();//
                            $this.find("td").removeClass('selecteds');
                            multiselectflag=0;
                        }
                        if(!$(this).data("selected")&&multiselectflag<2){
                            multiselectflag++;
                        }else{
                            multiselectflag=1;
                            $this.find("td.selected").find(".timeslot").remove();//
                            $this.find("td").removeClass('selected').removeData("selected");
                            $this.find("td").removeClass('selecteds');
                        }
                        var selecteddate=$this.find("td.selected"),
                            oneyear=selecteddate.parent().parent().parent().data("year"),
                            onemonth=selecteddate.parent().parent().parent().data("month"),
                            oneday=selecteddate.find(".date-title").text()=="今天"?mydate.getDate():selecteddate.find(".date-title").text();
                        var onedate=oneyear+"-"+private_methods.p(onemonth+1)+"-"+private_methods.p(oneday);
                        if(!private_methods.duibi(onedate,date)){
                            multiselectflag=1;
                            $this.find("td").removeClass('selected').removeData("selected").find(".timeslot").remove();//
                            $this.find("td").removeClass('selecteds');
                        }else if(private_methods.dateDiff(onedate,date)>opts.optionaldays){
                            alert("日历选择大于"+opts.optionaldays+"天！");
                            multiselectflag=1;
                            return false;
                        }
                        var table=$(this).parent().parent().parent();
                        var index=table.find("td").index($(this)),oneindex=table.find("td").index(selecteddate);
                        if(mymonth==onemonth&&myyear==oneyear){
                            table.find("td:lt("+index+"):gt("+oneindex+")").addClass('selecteds');
                        }else if(mymonth>onemonth&&myyear==oneyear){ //结束月 大于 开始月
                            var first=table.find("td").index(table.find("td[data=prevM]:last")),
                                last=$("table[data-month="+onemonth+"]").find("td").index($("table[data-month="+onemonth+"]").find("td[data=nextM]:first"));
                            var previndex=$("table[data-month="+onemonth+"]").find("td").index(selecteddate);
                            $("table[data-month="+onemonth+"]").find("td:lt("+last+"):gt("+previndex+")").addClass('selecteds');
                            if(first<0){
                                table.find("td:lt("+index+")").addClass('selecteds');
                            }else{
                                table.find("td:lt("+index+"):gt("+first+")").addClass('selecteds');
                            }
                        }else if(myyear>oneyear){ //结束年 大于开始年
                            var first=table.find("td").index(table.find("td[data=prevM]:last")), //当前月第几个格子开始。
                                last=$("table[data-month="+onemonth+"]").find("td").index($("table[data-month="+onemonth+"]").find("td[data=nextM]:first")); //当前月第几个格子结束。
                            var previndex=$("table[data-month="+onemonth+"]").find("td").index(selecteddate); //当前月下面几个选中的。
                            $("table[data-month="+onemonth+"]").find("td:lt("+last+"):gt("+previndex+")").addClass('selecteds');
                            if(first<0){
                                table.find("td:lt("+index+")").addClass('selecteds');

                            }else{

                                table.find("td:gt("+index+"):lt("+first+")").addClass('selecteds');
                            }
                        }
                        $(this).data("selected",true).addClass('selected');
                        if(multiselectflag==1){
                            // $(this).find(".calendar-explian").prepend("<span class='timeslot timeslot-start'>入</span>");//入住
                        }
                        if(multiselectflag==2){
                            // $(this).find(".calendar-explian").prepend("<span class='timeslot timeslot-end'>离</span>"); //离店
                            opts.onClick(this,[onedate,date]);
                        }
                    }
                    else{
                        $this.find("td").removeClass('selected');
                        //$this.find("td").find(".date-title").html(methods_date);// 标题位置 放 当前日
                        $(this).addClass('selected');
                        $(this).attr('data-day',$(this).find(".date-title").text());
                        $this.find('td').each(function (index,item){
                            var _day = $(item).data('day');

                            if (_day){
                                $(item).find(".date-title").html(_day);
                            }
                        });
                        //$(this).find(".date-title").html("余"+ticket);//
                        console.log(price,ticket)
                        opts.onClick(this,date,price,ticket);
                    }
                });
            });
        },
        publicMethod : function(){
            private_methods.demoMethod();
        }
    };

    // 私有方法
    var private_methods = {
        flipFuns:function(year, month,opts,i){
            calendar.makeDateHtml(year, month,opts,i);
        },
        p:function(s){
            return s < 10 ? '0' + s: s;
        },
        duibi:function(a, b){
            var starttimes=0,lktimes=0;
            if(a!=null&&b!=null){
                var arr = a.split("-");
                var starttime = new Date(arr[0], parseInt(arr[1])-1, arr[2]);
                starttimes = starttime.getTime();
                var arrs = b.split("-");
                var lktime = new Date(arrs[0], parseInt(arrs[1])-1, arrs[2]);
                lktimes = lktime.getTime();
                if (starttimes >= lktimes) {
                    return false;
                }
                else{
                    return true;
                }
            }
            else{
                return false;
            }
        },
        dateDiff:function(strDateStart,strDateEnd){
            var strSeparator = "-"; //日期分隔符
            var oDate1;
            var oDate2;
            var iDays;
            oDate1= strDateStart.split(strSeparator);
            oDate2= strDateEnd.split(strSeparator);
            var strDateS = new Date(oDate1[0], oDate1[1]-1, oDate1[2]);
            var strDateE = new Date(oDate2[0], oDate2[1]-1, oDate2[2]);
            iDays = parseInt(Math.abs(strDateS - strDateE ) / 1000 / 60 / 60 /24); //把相差的毫秒数转换为天数
            return iDays ;
        },
        price:function(date,opts){
            var len=opts.settingdata.length,pricetext="",show=false; //加个默认暂无库存，不要就为空
            //console.log(opts.settingdata);
            if(len>0){
                for(var i= 0;i<len;i++){
                    var targetdate=opts.settingdata[i].date;
                    var stock = 0;
                    if(opts.settingdata[i].stock === 0 || opts.settingdata[i].adultLeftNum === 0){
                        stock = 0
                    }else if(typeof opts.settingdata[i].stock == 'undefined'){
                        stock = '无限库存'
                    }else{
                        stock = opts.settingdata[i].stock || opts.settingdata[i].adultLeftNum;
                    }
                    var price = opts.settingdata[i].price||opts.settingdata[i].adultPrice;
                    if(date==targetdate){
                        if(opts.stock && opts.priceshow){
                            pricetext="<span class='price' data-ticket='"+stock+"'><em>￥</em><strong>"+price+"</strong></span>";
                            pricetext+="<span class='p_ticket'>余"+stock+"</span>";
                        }else if(!opts.stock && opts.priceshow){
                            pricetext="<span class='price' data-ticket='"+stock+"'><em>￥</em><strong>"+price+"</strong></span>";
                        }else if(opts.stock && !opts.priceshow){
                            pricetext="<span class='p_ticket'>余"+stock+"</span>";
                        }else{
                            pricetext=" ";
                        }
                        show=true;
                    }
                }
            }
            return [pricetext,show];
        },
        settingdate:function(data){
            var date=[];
            $.each(data,function(i){
                date.push(data[i].date);
            });
            return date;
        }
    };

    var mydate = new Date(),
        monthArray = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
        dayArray = ["日", "一", "二", "三", "四", "五", "六"];
    var myyear="",mymonth="";
    var dhtml=["",""];
    var monthnum=2;
    //函数主体
    var calendar = {
        calendarHead: function(datearray,opts){
            var obj = document.createElement('div');
            obj.className="calendar-head";
            $(obj).append(datearray.join(""));
            return obj;
        },
        monthdays: function(year) {
            var monthdays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
            if (year % 4 == 0 && (year % 100 != 0 || year % 400 == 0)) {
                monthdays[1] = 29;
            }
            return monthdays;
        },
        flip: function(id, text, funs,opts) {
            var yearPrev = $("<a>", {
                "id": id,
                "href": "javascript:void(0);",
                "html": text
            }).bind("click", function() {
                if (funs) {
                    switch (id) {
                        case "yearPrev":
                            myyear--;
                            break;
                        case "monthPrev":
                            mymonth--;
                            if (mymonth < 0) {
                                myyear--;
                                mymonth = 11;
                            }
                            break;
                        case "monthNext":
                            mymonth++;
                            if (mymonth > 11) {
                                myyear++;
                                mymonth = 0;
                            }
                            break;
                        case "yearNext":
                            myyear++;
                            break;
                    }
                    calendar.calendarTopBox.html("");
                    var month=mymonth,year=myyear,prevmonth=mymonth+1;
                    for(var i=0;i<monthnum;i++){

                        switch (id) {
                            case "monthPrev":
                                prevmonth=prevmonth-i;
                                if (prevmonth < 0) {
                                    year--;
                                    prevmonth = 11;
                                }
                                calendar.calendarTopBox.prepend(calendar.calendarHead(calendar.today(year, prevmonth),opts));
                                funs(year, prevmonth,opts,i);
                                break;
                            case "monthNext":
                                month=month+i;
                                if (month > 11) {
                                    year++;
                                    month = 0;
                                }
                                console.log(month)
                                calendar.calendarTopBox.append(calendar.calendarHead(calendar.today(year,month),opts));
                                funs(year, month,opts,i);
                                break;
                        }
                        
                        
                        
                        
                    }
                    calendar.contentHtml(dhtml,id);
                    
                }
            });
            return yearPrev;
        },
        today: function(year, month) {
            var year = '<span>'+year + '年</span>';
            var month = '<span>'+monthArray[month]+'</span>';
            return [year, month];
        },
        calendarContent: $("<div>", {
            "class": "calendar-contnet"
        }),
        dayHtml: function(opts) {
            // var html = "<tr>";
            // $.each(dayArray, function(i) {
            //     html += "<th>" + dayArray[i] + "</th>";
            // });
            // html += "</tr>";
            var html="<ul class='calendar-day'>";
            $.each(dayArray,function(i){
                html+='<li>'+ dayArray[i] +'</li>';
            });
            html+='</ul>';
            return html;
        },
        dateHtml: function(year, month,opts) {
            var html = '<table width="100%" cellspacing="0" cellpadding="0" data-year="'+year+'" data-month="'+month+'"><tr>',
                monthdays = this.monthdays(year),
                days = monthdays[month],
                presentDate = new Date(year, month),
                flag=true;
                
            var today = mydate.getFullYear() + "-" +private_methods.p(mydate.getMonth() + 1) + "-" + private_methods.p(mydate.getDate());
            for (var i = 0; i < presentDate.getDay(); i++) {
                var tyear=month == 0 ? year-1 : year;
                var tmonth = month == 0 ? 12 : month;
                var previtemDay=tyear + "-" + private_methods.p(tmonth) + "-" + private_methods.p(monthdays[tmonth - 1] - presentDate.getDay() + i + 1);
                if(opts.settingdata.length!=0){
                    html += "<td ";
                    if($.inArray(previtemDay,private_methods.settingdate(opts.settingdata))==-1){
                        html+=" class='other'";
                    }
                    html+=" data='prevM'>";
                }
                else{
                    if(private_methods.duibi(previtemDay, opts.stratday)||private_methods.duibi(opts.endday,previtemDay)){
                        html += "<td class='other' data='prevM'>";
                    }
                    else{
                        html += "<td class='prevM' data='prevM'>";
                    }
                }
                html +="<span class='date-title'>"+(monthdays[tmonth - 1] - presentDate.getDay() + i + 1) + "</span><p class='calendar-explian'></p></td>";
                // html+="</td>";
            }

            for (var j = 0; j < days; j++) {
                var itemDay = year + "-" + private_methods.p(month + 1) + "-" + private_methods.p(j + 1);
                var pricedata=private_methods.price(itemDay,opts);
                var titleAlign="";
                html+="<td ";
                if(opts.multiselect){
                    titleAlign=" "
                }else{
                    titleAlign="tA_c"
                }
                if(today == itemDay){
                    if(pricedata[1] || opts.settingdata=="" ){
                        html += ">";
                    }else{
                        html += " class='other'>";
                    }
                    //if($.inArray(today,private_methods.settingdate(opts.settingdata))>-1){
                    if(typeof opts.selecteday=="string"&&opts.selecteday==itemDay){
                        html+="<span class='date-title "+titleAlign+"'>今天</span><p class='calendar-explian'>"+pricedata[0]+"</p>";
                    }
                    else if(opts.selecteday[0]==itemDay){
                        //html+="<span class='date-title "+titleAlign+"'>今天</span><p class='calendar-explian'>"+pricedata[0]+"<span class='timeslot timeslot-start'>入</span></p>";
                        html+="<span class='date-title "+titleAlign+"'>今天</span><p class='calendar-explian'>"+pricedata[0]+"</p>";
                    }
                    else if(opts.selecteday[1]==itemDay){
                        //html+="<span class='date-title "+titleAlign+"'>今天</span><p class='calendar-explian'>"+pricedata[0]+"<span class='timeslot timeslot-end'>离</span></p>";
                        html+="<span class='date-title "+titleAlign+"'>今天</span><p class='calendar-explian'>"+pricedata[0]+"</p>";
                    }
                    else{

                        html+="<span class='date-title "+titleAlign+"'>今天</span><p class='calendar-explian'>"+pricedata[0]+"</p>";
                    }
                    //}
                    //else{
                    //    html += ">";
                    //}
                }
                else if(typeof opts.selecteday=="string"&&opts.selecteday==itemDay){
                    html += " class='selected'><span class='date-title "+titleAlign+"'>" + (j + 1) + "</span><p class='calendar-explian'>"+pricedata[0]+"</p>";
                }
                else if(opts.selecteday[0]==itemDay){
                    //html += " class='selected'><span class='date-title "+titleAlign+"'>" + (j + 1) + "</span><p class='calendar-explian'>"+pricedata[0]+"<span class='timeslot timeslot-start'>入</span></p>";
                    html += " class='selected'><span class='date-title "+titleAlign+"'>" + (j + 1) + "</span><p class='calendar-explian'>"+pricedata[0]+"</p>";
                }
                else if(opts.selecteday[1]==itemDay){
                    //html += " class='selected'><span class='date-title "+titleAlign+"'>" + (j + 1) + "</span><p class='calendar-explian'>"+pricedata[0]+"<span class='timeslot timeslot-end'>离</span></p>";
                    html += " class='selected'><span class='date-title "+titleAlign+"'>" + (j + 1) + "</span><p class='calendar-explian'>"+pricedata[0]+"</p>";
                }
                else{
                    if(opts.settingdata.length!=0){
                        if($.inArray(itemDay,private_methods.settingdate(opts.settingdata))==-1){
                            html+=" class='other'";
                        }else if((presentDate.getDay() + j + 1) % 7==0||(presentDate.getDay() + j + 1) % 7==1){
                            html += " class='weekend'";
                        }
                    }
                    else{
                        if(private_methods.duibi(itemDay, opts.stratday)||private_methods.duibi(opts.endday,itemDay)){
                            html += " class='other'";
                        }
                    }
                    html += "><span class='date-title "+titleAlign+"'>" + (j + 1) + "</span><p class='calendar-explian'>"+pricedata[0]+"</p>";
                }
                html += "</td>";
                if ((presentDate.getDay() + j + 1) % 7 == 0) {
                    html += "<tr>";
                }
            }
            for (var k = 0; k < 42 - presentDate.getDay() - days; k++) {
                var nextitemDay=year + "-" + private_methods.p(month+2) + "-" + private_methods.p(k + 1);
                if(month+2>12){
                    nextitemDay=(year+1) + "-01-" + private_methods.p(k + 1);
                }
                if(opts.settingdata.length!=0){
                    html += "<td class='other'";
                    if($.inArray(nextitemDay,private_methods.settingdate(opts.settingdata))==-1){
                        //html+=" class='other'";
                    }
                    html+=" data='nextM'>";
                }
                else{
                    if(private_methods.duibi(nextitemDay, opts.stratday)||private_methods.duibi(opts.endday,nextitemDay)){
                        html += "<td class='other' data='nextM'>";
                    }else{
                        html += "<td class='nextM' data='nextM'>";
                    }
                }

                html +="<span class='date-title'>"+(k + 1)+ "</span><p class='calendar-explian'></p></td>";
                // html += "</td>";
                if ((presentDate.getDay() + days + k + 1) % 7 == 0) {
                    html += "<tr>";
                }

            }
            html += "</tr></table>";
            return html;
        },
        calendarMonth: function(){
            var month = $("<div>", {
                "class": "calendar-month"
            });
            var monthday=$("<div>", {
                "class": "calendar-monthday"
            });
            var content=$("<div>", {
                "class": "calendar-month-content"
            });
            return [month,monthday,content];
        },
        calendarAll:$("<div>", {
            "class": "calendar-all"
        }),
        calendarTop:$("<div>", {
            "class": "calendar-top"
        }),
        calendarTopBox:$("<div>", {
            "class": "calendar-top-box"
        }),
        makeDateHtml: function(year, month,opts,index) {
            //this.calendarHead.append(this.today(year, month)[0], this.today(year, month)[1]);
            var $calendarMonth =this.calendarMonth()[0][0];
            var $calendarMonthDay=this.calendarMonth()[1][0];
            var $calendarMonthContent=this.calendarMonth()[2][0];
            
            $($calendarMonthDay).html(this.dayHtml());
            $($calendarMonthContent).html(this.dateHtml(year, month,opts));
            this.calendarContent.append($calendarMonth);
            $($calendarMonth).append($calendarMonthDay,$calendarMonthContent);
            dhtml[index]=$calendarMonth;
        },
        contentHtml:function(d,id){
            this.calendarAll.html("");
            for(var i=0;i<d.length;i++){
                switch (id){
                    case "monthPrev":
                        this.calendarAll.prepend(d[i]);
                        break;
                    default:
                        this.calendarAll.append(d[i]);
                        break;
                }
            }
            this.calendarContent.html(this.calendarAll);
        },
        makecalendar: function(obj,opts) {
            var $calendarHead = this.calendarHead,
                $calendarContent = this.calendarContent;
            $calendarContent.html("");
            //$calendarContent.prepend($calendarHead);
            //$calendarHead.find("li:eq(0)").append(this.flip("yearPrev", "<<", flipFuns));
            // console.log($calendarHead())
            //$calendarHead.find("li:eq(4)").append(this.flip("yearNext", ">>", flipFuns));
            // var selectd=opts.selecteday.split("-");
            //this.makeDateHtml(2015, 2);
            
            for(var i=0;i<monthnum;i++){
                var year=mydate.getFullYear(),month=mydate.getMonth()+i;
                if(month>11){
                    year=year+1;
                    month=month-12;
                }

                this.makeDateHtml(year, month,opts,i);
                //判断最后一行是否全空，是就隐藏
                if($(".calendar-contnet table").eq(i).find("tr").eq(5).find("td[data=nextM]").length==7){
                    $(".calendar-contnet table").eq(i).find("tr").eq(5).find("td[data=nextM]").hide();
                }

                this.calendarTopBox.append(this.calendarHead(this.today(year, month),opts));
            }
            this.contentHtml(dhtml);
            this.calendarTop.append(this.calendarTopBox);
            this.calendarTop.append(this.flip("monthPrev", "<", private_methods.flipFuns,opts),this.flip("monthNext", ">", private_methods.flipFuns,opts));

            $(obj).append(this.calendarTop,$calendarContent);

        }
    };
    // 默认参数
    $.fn.calendar.defaults = {
        width: "auto",
        selecteday:mydate.getFullYear()+"-"+(mydate.getMonth()+1)+"-"+mydate.getDate(),
        stratday:mydate.getFullYear()+"-"+(mydate.getMonth()+1)+"-"+mydate.getDate(),
        endday:null,
        settingdata:[],     //限定日期数，数组
        stock:true,         //true带库存，false不带库存
        priceshow:true,     //true显示价格，false不显示
        multiselect:true,  //是否选择时间段
        optionaldays:15,    //限制选择时间段的天数
        onClick: function(evl,date,price,ticket) {}
    };

})(jQuery);