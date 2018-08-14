//连缀写法
var myJquery = function(args){
	return new Base(args)
}
function Base(args){
	this.elements = [];

	if(typeof args == "string"){
		switch(args.charAt(0)){
			case"#":
				this.getId(args.substring(1))
				break;
			case".":
				this.getClass(args.substring(1));
				break;
			default:
				this.getTagName(args);
		}
	}else if(typeof args == "object"){
		if (args != underfined) {
			this.elements[0] = args;
		};
	}
}

//获取classname
Base.prototype.getClass = function(className,idName){
  var node = null;
  if(arguments.length == 2){
  	node = document.getElementById(idName);
  }else{
  	node = document;
  }
  var all = node.getElementsByTagName("*");
  for(var i=0;i<all.length;i++){
  	if(all[i].className == className){
  		this.elements.push(all[i]);
  	}
  }
}


//获取ID
Base.prototype.getId = function(id){
	this.elements.push(document.getElementById(id));
}

//获取同类元素
Base.prototype.getTagName = function(tag){
	var tags = document.getElementsByTagName(tag);
	for(var i=0;i<tags.length;i++){
		this.elements.push(tags[i])
	}
}

//设置classname
Base.prototype.getClass = function(className){
	var all = document.getElementsByTagName("*");
	for(var i=0;i<all.length;i++){
		if(all[i].className == className){
			this.elements.push(all[i]);
		}
	}
	return this;
}
Base.prototype.myfun = function(opts,callback){
	var option={};
    var newopts = $.extend({},option,opts);//合并参数
}

