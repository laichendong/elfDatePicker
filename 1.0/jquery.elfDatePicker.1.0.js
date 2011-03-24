$(function(){
	$('<style>.f_l{float:left; _display:inline;} .f_r{float:right; _display:inline;} .clearfix:after {content:" "; display:block; clear:both; visibility:hidden; _line-height:0; height:0; } .clearfix {display: inline-block; } html[xmlns] .clearfix {display: block; }  .elfDatePicker{ 	width:13em; 	border: 1px solid #d2d2d2; 	border-radius: 3px; 	-moz-border-radius: 3px; 	-webkit-border-radius: 3px; 	box-shadow: 2px 2px 3px #eee; 	-moz-box-shadow: 2px 2px 3px #eee; 	-webkit-box-shadow: 2px 2px 3px #eee; 	padding:0.2em; 	background:#fcfcfc; 	background: -moz-linear-gradient(top, #fcfcfc, #fff); 	background: -webkit-gradient(linear, left top, left bottom, from(#fcfcfc), to(#fff) ); 	position:absolute; } .elfDatePicker *{ 	color:#333; } .elfDatePicker a{ 	text-decoration:none; } .elfDatePickerTitle,.elfDatePickerBottom{ 	display:block; } .elfDatePickerTitle,.elfDatePickerBottom,.elfDatePickerCalendar td{ 	border-radius: 3px; 	-moz-border-radius: 3px; 	-webkit-border-radius: 3px; 	background:#f9f9f9; 	background: -moz-linear-gradient(top, #f9f9f9, #f1f1f1); 	background: -webkit-gradient(linear, left top, left bottom, from(#f9f9f9), to(#f1f1f1) ); 	border: 1px solid #e6e6e6; } .elfDatePickerMonthWarp, .elfDatePickerYearWarp{ 	font-weight:600; 	font-size:0.9em; 	text-align:center; 	margin:3px; } .elfDatePickerMonth,.elfDatePickerYear{ 	padding:0 0.3em; 	height:1em; } .elfDatePickerTitlePrevMonth,.elfDatePickerTitleNextMonth,.elfDatePickerTitlePrevYear,.elfDatePickerTitleNextYear{ 	display:block; 	width:1em; 	height:1em; 	line-height:1em; } .elfDatePickerTitlePrevMonth,.elfDatePickerTitleNextMonth,.elfDatePickerTitlePrevYear,.elfDatePickerTitleNextYear,.elfDatePickerCalendar td.elfDatePickerCelToday,.elfDatePickerTodayBtn, .elfDatePickerClearBtn{ 	border: 1px solid #adb9c2; 	border-radius: 3px; 	-moz-border-radius: 3px; 	-webkit-border-radius: 3px; 	background:#eee; 	background: -moz-linear-gradient(top, #eee, #d2d2d2); 	background: -webkit-gradient(linear, left top, left bottom, from(#eee), to(#d2d2d2) ); } .elfDatePickerTitlePrevMonth:hover,.elfDatePickerTitleNextMonth:hover,.elfDatePickerTitlePrevYear:hover,.elfDatePickerTitleNextYear:hover,.elfDatePickerCalendar td.elfDatePickerCelHover,.elfDatePickerCalendar td.elfDatePickerCelChecked,.elfDatePickerTodayBtn:hover, .elfDatePickerClearBtn:hover{ 	background:#FDF595; 	background: -moz-linear-gradient(top, #FDF595, #FBDE4B); 	background: -webkit-gradient(linear, left top, left bottom, from(#FDF595), to(#FBDE4B) ); 	border: 1px solid #fdc367; 	color:#D0260F; } .elfDatePickerCalendar th{ 	font-weight:normal; } .elfDatePickerCalendar{ 	width:100%; } .elfDatePickerCalendar td{ 	cursor:pointer; 	width:1.3em; 	height:1em; 	line-height:1em; 	margin:0.3em; 	text-align:right; 	padding:0.2em; } .elfDatePickerCalendar td.elfDatePickerCelDisable{ 	background:#fff; 	background: -moz-linear-gradient(top, #fff, #f3f3f3); 	background: -webkit-gradient(linear, left top, left bottom, from(#fff), to(#f3f3f3) ); 	border: 1px solid #f1f1f1; 	color:#aaa; }  .elfDatePickerBottom{ 	margin-top:3px; } .elfDatePickerTodayBtn, .elfDatePickerClearBtn{ 	padding:2px 5px; 	margin:3px; 	height:1em; 	line-height:1em; }</style>').appendTo("head");
});
(function($){
	//插件方法
	$.fn.elfDatePicker = function(options) {
		$.fn.elfDatePicker._options = $.extend($.fn.elfDatePicker._options, options);
		return this.each(function() {
			var dpUUID = "elfDatePicker" + new Date().getTime();
			$(this).data("dpUUID", dpUUID);
			var elfDatePickerObj = $.fn.elfDatePicker.build($(this),$.fn.elfDatePicker.stringToDate($(this).val()));
			//事件绑定
			$.fn.elfDatePicker.eventHandller($(this), elfDatePickerObj);
			$(this).focus(function(){
				var selectedDate = $.fn.elfDatePicker.stringToDate($(this).val())
				if(selectedDate){
					$.fn.elfDatePicker.rend(elfDatePickerObj,selectedDate.getFullYear(),selectedDate.getMonth(),selectedDate);
				}else{
					$.fn.elfDatePicker.rend(elfDatePickerObj,new Date().getFullYear(), new Date().getMonth());
				}
				$.fn.elfDatePicker.show(elfDatePickerObj);
			})
			.click(function(){return false;});
		});
	};
	//插件默认选项
	$.fn.elfDatePicker._options = {
		monthLabel : ["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"],
		weekLabel : ["日","一","二","三","四","五","六"],
		afterPicked : function(){}
	}
	//构建html结构
	$.fn.elfDatePicker.build = function(inputer,selectedDate){
		var dpUUID = inputer.data("dpUUID");
		var elfDatePickerObj = $('<div class="elfDatePicker" style="display:none;" id="'+dpUUID+'"></div>').appendTo("body");
		//渲染月历
		if(selectedDate){
			elfDatePickerObj = $.fn.elfDatePicker.rend(elfDatePickerObj,selectedDate.getFullYear(),selectedDate.getMonth(),selectedDate);
		}else{
			elfDatePickerObj = $.fn.elfDatePicker.rend(elfDatePickerObj,new Date().getFullYear(), new Date().getMonth());
		}
		//设置位置
		$.fn.elfDatePicker.setPosition(inputer, elfDatePickerObj);
		return elfDatePickerObj;
	}
	
	//渲染月历，月份从0开始,selectedDate不是必要参数
	$.fn.elfDatePicker.rend = function(elfDatePickerObj, year, month, selectedDate){
		elfDatePickerObj.empty();
		//头部年月
		elfDatePickerObj.append(
			'<div class="elfDatePickerTitle clearfix">' + 
			'	<div class="elfDatePickerMonthWarp f_l clearfix">' +
			'		<a class="elfDatePickerTitlePrevMonth f_l" title="上月" href="javascript:void(0);">﹤</a>' + 
			'		<span class="elfDatePickerMonth f_l" value="' + month + '">' + $.fn.elfDatePicker._options.monthLabel[month] + '</span>' + 
			'		<a class="elfDatePickerTitleNextMonth f_l" title="下月" href="javascript:void(0);">﹥</a>' + 
			'	</div>' + 
			'	<div class="elfDatePickerYearWarp f_r clearfix">' + 
			'		<a class="elfDatePickerTitleNextYear f_r" title="明年" href="javascript:void(0);">﹥</a>' +
			'		<span class="elfDatePickerYear f_r">'+ year +'</span>' +
			'		<a class="elfDatePickerTitlePrevYear f_r" title="去年" href="javascript:void(0);">﹤</a>' +
			'	</div>' +
			'</div>'
		);
		//月历表格
		elfDatePickerObj.append(
			'<table class="elfDatePickerCalendar">' +
			'<thead>' +
			'	<tr></tr>' +
			'</thead>' +
			'<tbody>' +
			'</tbody>' +
			'</table>'
		);
		//表头
		$.each($.fn.elfDatePicker._options.weekLabel,function(index,item){
			elfDatePickerObj.find(".elfDatePickerCalendar thead tr ").append('		<th><span title="星期'+this+'">'+ this +'</span></th>')
		});
		//表体
		var firstDayInMonth = new Date(year, month, 1);//这个月第一天
		var daysOfMonth = $.fn.elfDatePicker.daysOfMonth(year, month);//这个月一共有几天
		var lastDayInMonth = new Date(year, month, daysOfMonth);//这个月最后一天
		var tabelHtml = "<tr>";
		//月历中“上个月”的几天
		for(var i=firstDayInMonth.getDay(); i>0; i--){
			var y = m = d = "";
			var daysOfPrevMonth;
			if(month == 0){
				daysOfPrevMonth = $.fn.elfDatePicker.daysOfMonth(year-1, 11);
				y = (year-1) + "";
				m = "12";
			}else{
				daysOfPrevMonth = $.fn.elfDatePicker.daysOfMonth(year, month-1);
				y = year + "";
				m = month + "";
				if(month < 10){
					m = "0" + month;
				}
			}
			d = (daysOfPrevMonth-i+1) + "";
			var date = y + "-" + m + "-" + d;
			tabelHtml += ('<td class="elfDatePickerCelDisable" date="'+date+'">'+d+'</td>');
		}
		//当月月历
		for(var j=1; j<=daysOfMonth; j++){
			var y = m = d = "";
			y = year + "";
			if(parseInt(month) < 9){
				m = "0"+(parseInt(month)+1);
			}else{
				m = (parseInt(month)+1) + "";
			}
			if(j<10){
				d = "0" + j;
			}else{
				d = j + "";
			}
			var date = y + "-" + m + "-" + d;
			tabelHtml += ('<td date="'+date+'">'+j+'</td>');
			//换行
			if(new Date(year, month, j).getDay() == 6){
				tabelHtml += ('</tr><tr>');
			}
		}
		//月历中“下个月”的几天
		var n = 1;
		for(var k=lastDayInMonth.getDay(); k<6; k++){
			var y = m = d = "";
			var daysOfPrevMonth;
			if(parseInt(month) == 11){
				y = (year+1) + "";
				m = "01";
			}else{
				y = year + "";
				m = (parseInt(month)+2) + "";
				if(parseInt(month) < 8){
					m = "0" + (parseInt(month)+2);
				}
			}
			d = "0"+n;
			var date = y + "-" + m + "-" + d;
			tabelHtml +=('<td class="elfDatePickerCelDisable" date="'+date+'">'+n+'</td>');
			n++;
		}
		tabelHtml += ('</tr>');
		elfDatePickerObj.find(".elfDatePickerCalendar tbody").append(tabelHtml);
		//如果日历中有“今天”的日期，标记出来
		elfDatePickerObj.find(".elfDatePickerCalendar tbody td[date='"+$.fn.elfDatePicker.dateToString(new Date())+"']").addClass("elfDatePickerCelToday");
		//如果日历中有“被选中的日期”,标记起来
		if(selectedDate){
			elfDatePickerObj.find(".elfDatePickerCalendar tbody td[date='"+$.fn.elfDatePicker.dateToString(selectedDate)+"']").addClass("elfDatePickerCelChecked");
		}
		//快捷按钮
		elfDatePickerObj.append(
			'<div class="elfDatePickerBottom clearfix">' +
			'	<a class="elfDatePickerTodayBtn f_l" href="javascript:void(0);" title="选择今天">今天</a>' +
			'	<a class="elfDatePickerClearBtn f_r" href="javascript:void(0);" title="清除选择">清除</a>' +
			'</div>'
		);
		
		return elfDatePickerObj;
	}
	
	$.fn.elfDatePicker.eventHandller = function(inputer, elfDatePickerObj){
		var elfDatePickerId = "#" + elfDatePickerObj.attr("id");
		$(elfDatePickerId + " .elfDatePickerCalendar td").live("mouseover",function(){
			$(this).addClass(elfDatePickerId + " elfDatePickerCelHover");
		});
		$(elfDatePickerId + " .elfDatePickerCalendar td").live("mouseout",function(){
			$(this).removeClass(elfDatePickerId + " elfDatePickerCelHover");
		});
		//点击月历单元格
		$(elfDatePickerId + " .elfDatePickerCalendar td").live("click",function(){
			$("td").removeClass(elfDatePickerId + " elfDatePickerCelChecked");
			$(this).addClass(elfDatePickerId + " elfDatePickerCelChecked");
			inputer.val($(this).attr("date"));
			$.fn.elfDatePicker.hide(elfDatePickerObj);
			//如果有回调函数，调用之
			if($.fn.elfDatePicker._options.afterPicked){
				$.fn.elfDatePicker._options.afterPicked();
			}
		});
		//点击“上个月”按钮
		$(elfDatePickerId + " .elfDatePickerTitlePrevMonth").live("click",function(){
			var year = $(elfDatePickerId + " .elfDatePickerYear").text();
			var month = $(elfDatePickerId + " .elfDatePickerMonth").attr("value");
			if(month == 0){
				year --;
				month = 11;
			}else{
				month --;
			}
			$(elfDatePickerId + " .elfDatePickerYear").text(year);
			$(elfDatePickerId + " .elfDatePickerMonth").attr("value",month).text($.fn.elfDatePicker._options.monthLabel[month]);
			$.fn.elfDatePicker.rend(elfDatePickerObj, year, month);
		});
		//点击“下个月”按钮
		$(elfDatePickerId + " .elfDatePickerTitleNextMonth").live("click",function(){
			var year = $(elfDatePickerId + " .elfDatePickerYear").text();
			var month = $(elfDatePickerId + " .elfDatePickerMonth").attr("value");
			if(month == 11){
				year ++;
				month = 0;
			}else{
				month ++;
			}
			$(elfDatePickerId + " .elfDatePickerYear").text(year);
			$(elfDatePickerId + " .elfDatePickerMonth").attr("value",month).text($.fn.elfDatePicker._options.monthLabel[month]);
			$.fn.elfDatePicker.rend(elfDatePickerObj, year, month);
		});
		//点击“上一年”按钮
		$(elfDatePickerId + " .elfDatePickerTitlePrevYear").live("click",function(){
			var year = $(elfDatePickerId + " .elfDatePickerYear").text();
			var month = $(elfDatePickerId + " .elfDatePickerMonth").attr("value");
			year --;
			$(elfDatePickerId + " .elfDatePickerYear").text(year);
			$(elfDatePickerId + " .elfDatePickerMonth").attr("value",month).text($.fn.elfDatePicker._options.monthLabel[month]);
			$.fn.elfDatePicker.rend(elfDatePickerObj, year, month);
		});
		//点击“下一年”按钮
		$(elfDatePickerId + " .elfDatePickerTitleNextYear").live("click",function(){
			var year = $(elfDatePickerId + " .elfDatePickerYear").text();
			var month = $(elfDatePickerId + " .elfDatePickerMonth").attr("value");
			year ++;
			$(elfDatePickerId + " .elfDatePickerYear").text(year);
			$(elfDatePickerId + " .elfDatePickerMonth").attr("value",month).text($.fn.elfDatePicker._options.monthLabel[month]);
			$.fn.elfDatePicker.rend(elfDatePickerObj, year, month);
		});
		//点击“今天”按钮
		$(elfDatePickerId + " .elfDatePickerTodayBtn").live("click",function(){
			inputer.val($.fn.elfDatePicker.dateToString(new Date()));
			$.fn.elfDatePicker.hide(elfDatePickerObj);
		});
		//点击“清除”按钮
		$(elfDatePickerId + " .elfDatePickerClearBtn").live("click",function(){
			inputer.val("");
			$.fn.elfDatePicker.hide(elfDatePickerObj);
		});
		
		//判断点是否落在那些矩形里
		function pointInSquares(point, squares){
			for(var i=0; i<squares.length; i++){
				var square = squares[i];
				if(point.x>=square.left && point.x<=(square.left+square.width) && point.y>=square.top && point.y<=(square.top+square.height)){
					return true;
				}
			}
			return false;
		}
		var hideAll = function(event){
			var point = {
				x : event.pageX,
				y : event.pageY
			}
			var squares = [];
			$.each($(".elfDatePicker:visible"),function(){
				var square = {
					left : $(this).offset().left,
					top : $(this).offset().top,
					width : $(this).outerWidth(),
					height : $(this).outerHeight()
				}
				squares.push(square);
			});
			if(pointInSquares(point, squares)){
				return true;
			}else{
				$(".elfDatePicker").hide(200);
				return false;
			}
		}	
		$("body").unbind("click",hideAll).bind("click",hideAll);
	}
	
	//显示控件
	$.fn.elfDatePicker.show = function(elfDatePickerObj){
		elfDatePickerObj.css("position","absolute").show(200);
	}
	//影藏控件
	$.fn.elfDatePicker.hide = function(elfDatePickerObj){
		elfDatePickerObj.hide(200);
	}
	//设置控件位置
	$.fn.elfDatePicker.setPosition = function(inputer, elfDatePickerObj){
		elfDatePickerObj.offset({
			left : inputer.offset().left,
			top : inputer.offset().top + inputer.outerHeight()
		});
	}
	
	//日期到字符串
	$.fn.elfDatePicker.dateToString = function(date){
		var year = date.getFullYear();
		var month = date.getMonth()+1;
		if(month < 10){
			month = "0"+month;
		}
		var date = date.getDate();
		if(date < 10){
			date = "0"+date;
		}
		return year + "-" + month + "-" + date;
	}
	//字符串到日期
	$.fn.elfDatePicker.stringToDate  = function(string){
		var result = string.match(/(\d{4})-(\d{2})-(\d{2})/)
		try{
			var dayOfMonth = $.fn.elfDatePicker.daysOfMonth(result[1],(result[2]-1));
			if(result[3] <= dayOfMonth){
				return new Date(result[1], (result[2]-1), result[3]);
			}else{
				return new Date();
			}
		}catch(e){
			return new Date();
		}
	}
	//计算某年某月有多少天,注意月份是从0开始的
	$.fn.elfDatePicker.daysOfMonth = function(year, month){
		return new Date(year, month+1, 0).getDate();
	}
	//扩展jQuery的静态方法
	$.elfDatePicker = function(options){
		$(":text.dateInputer").elfDatePicker(options);
	}
})(jQuery)