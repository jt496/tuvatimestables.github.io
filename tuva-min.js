starttime=new Date();ttables=new Array();otables=new Array();dumped=0;speed=0;occ=new Array();fini=0;qremain=0;function displayRes(d,a,f){f=typeof f!=="undefined"?f:"Times tables ";var e=d.split(":");var c="<div id='records'><p style='color:#FF0000;'>"+a+"'s records:</p>";for(var b=0;b<e.length/2;b++){c+=f;var g=e[2*b].split(",");g.shift();while(g.length>1){c+=g.shift();c+=", "}c=c+" on level "+g[0]+". Time taken: "+e[2*b+1]+"<br>"}c+="<p><button id='recordbut' onclick='choosequestions()' style='visibility=visible;'>Play</button></p></div>";$("body").prepend(c).show();$("#recordbut").focus()}function choosequestions(){$("#records").remove();for(var c=1;c<=12;c++){$("#sum").append("<div  class='tt' id='tt_"+c+"'>"+c+"</div>").show()}$("#sum").prepend("Which times tables?");$("#sum").show();$("#levelp").css("visibility","visible").show();$("#answer").css("visibility","visible").show();$(".tt").click(function(){$(this).animate({marginLeft:"40px"},"slow");var d=parseInt($(this).attr("id").substring(3));if($.inArray(ttables,d)<0){ttables.push(d);otables.push(d)}});for(var b=0;b<12;b++){occ[b]=new Array();for(var a=0;a<12;a++){occ[b].push(0)}}$(document).scrollTop(0)}function getCookie(b){var c=document.cookie;var d=c.indexOf(" "+b+"=");if(d==-1){d=c.indexOf(b+"=")}if(d==-1){c=null}else{d=c.indexOf("=",d)+1;var a=c.indexOf(";",d);if(a==-1){a=c.length}c=unescape(c.substring(d,a))}return c}function setCookie(a,d,b){var e=new Date();e.setDate(e.getDate()+b);var c=escape(d)+((b==null)?"":"; expires="+e.toUTCString());document.cookie=a+"="+c}function setname(){username=$("#namebox").val();if(username!=null&&username!=""&&username.length<30){setCookie("username",username,365);choosequestions()}else{$("#namebox").val("")}}function checkCookie(){var b=getCookie("username");var a=getCookie("results");if(b==null||b==""){getname="<div id='records'><p style='color:#FF0000;'>Please enter your name:</p><input type='text' class='box' id='namebox'  style='width:250px;'/><button id='namebut' onClick='setname()' >Go!</button></div>";$("body").prepend(getname);$("#namebox").keydown(function(c){if(c.which==13){document.getElementById("namebut").click()}})}if(a!=null&&a!=""){displayRes(a,b)}else{if(b!=null&&b!=""){choosequestions()}}}function myarraySum(a){var b=0;$.each(a,function(){b+=this});return b}function sortNumber(d,c){return d-c}function getColour(a,b){if(b==0){return"#000000"}if(a<timelevel){return"#FF0000"}if(a<2*timelevel){return"#FFCC00"}if(a<4*timelevel){return"#FFFF00"}if(a<8*timelevel){return"#66FF00"}if(a<16*timelevel){return"#00CCFF"}return"#0000FF"}function Dump(){if(typeof ttables=="undefined"||ttables.length==0){for(var a=1;a<=12;a++){ttables.push(a);otables.push(a)}}qremain=ttables.length*12;level=parseInt($("#levelchoice").val());if(level<=0||isNaN(level)){level=1}timelevel=20000/level;$("#levelp").remove();$(".tt").remove();$(document).scrollTop(0);dumped=1;progress_init()}function progress_init(c,d){c=typeof c!=="undefined"?c:13;d=typeof d!=="undefined"?d:13;progstr="";for(var b=0;b<c;b++){progstr=progstr+"<div class='progrow' id='row_"+b+"'>";for(var a=0;a<d;a++){if(b>0&&a>0){progstr=progstr+"<div class='prog' id='square"+b+"_"+a+"' style='background-color:#000000'></div>"}if(b==0&&a>0){progstr=progstr+"<div class='progbord' id='square"+b+"_"+a+"' style='background-color:#000000'>"+a+"</div>"}if(b>0&&a==0){if(ttables.indexOf(b)>=0){progstr=progstr+"<div class='progbord' id='square"+b+"_"+a+"' style='color:#FF0000'>"+b+"</div>"}else{progstr=progstr+"<div class='progbord' id='square"+b+"_"+a+"' style='background-color:#000000'>"+b+"</div>"}}if(b==0&&a==0){progstr=progstr+"<div class='progbord' id='square"+b+"_"+a+"' style='background-color:#000000'>X</div>"}}progstr=progstr+"</div>"}progstr=progstr+"<p> Level: "+level+"</p>";$("#progress").append(progstr)}function finished(){timetaken=new Date();timetaken-=starttime;timetaken/=1000;otables.sort(sortNumber);stables=" "+otables[0];for(var c=1;c<otables.length-1;c++){stables=stables+", "+otables[c]}if(otables.length>1){stables=stables+" and "+otables[otables.length-1];stables="You completed level "+level+" of your"+stables+" times tables in "+timetaken.toFixed(2)+" seconds."}else{stables="You completed level "+level+" of your"+stables+" times table in "+timetaken.toFixed(2)+" seconds."}$("#sum").text(stables).show();$("#sum").append("<p><button id='replaybut' onclick='location.reload()' style='visibility:visible;'>Play</button></p>").show();$("#answer").remove();$("#comment").remove();$("#score").remove();var b="";var f="ttt,"+otables.join()+","+level;var d=getCookie("results");if(d!=null&&d!=""){var a=d.split(":");var e=a.indexOf(f);if(e>=0&&parseFloat(a[e+1])>timetaken){$("body").prepend("<p>New Personal Record!</p>");a[e+1]=timetaken.toFixed(2);b=a.join(":");setCookie("results",b,365)}if(e<0){b=d+":"+f+":"+timetaken.toFixed(2);setCookie("results",b,365)}}else{b=f+":"+timetaken.toFixed(2);setCookie("results",b,365)}}function Question(){if(typeof Question.number=="undefined"){if(dumped==0){Dump()}starttime=new Date();Question.lasttime=starttime;Question.number=1;Question.correct=0;Question.b=Math.floor((Math.random()*12)+1);Question.a=ttables[Math.floor((Math.random()*ttables.length))];Question.ans=Question.a*Question.b;Question.q="Qu "+Question.number+":  What is "+Question.b+" x "+Question.a+" ? ";$("#sum").text(Question.q);$("#answerbox").css("display","inline");$("#answerbut").css("visibility","hidden")}else{Question.curtime=new Date();speed=Question.curtime-Question.lasttime;if($("#answerbox").val()==Question.ans){if(speed<timelevel){occ[Question.a-1][Question.b-1]=1;qremain--}else{occ[Question.a-1][Question.b-1]=-1}Question.correct++;$("#comment").finish().css("visibility","visible").text("Correct!").fadeTo(0,1).fadeTo(timelevel/2,0.3)}else{$("#comment").finish().css("visibility","visible").text("Wrong! "+Question.a+" x "+Question.b+" = "+Question.ans).fadeTo(0,1).fadeTo(timelevel,0.5);speed=0;occ[Question.a-1][Question.b-1]=0;for(var b=1;b<=12;b++){if(occ[Question.a-1][b-1]==1){qremain++}occ[Question.a-1][b-1]=0;curdiv="#square"+Question.a+"_"+b;$(curdiv).hide("explode",{pieces:16},1000).css("background-color","#000000")}}var a=getColour(speed,occ[Question.a-1][Question.b-1]);curdiv="#square"+Question.a+"_"+Question.b;$(curdiv).css("background-color",a).show();Question.lasttime=Question.curtime;$("#score").text("Score = "+Question.correct+"/"+Question.number);Question.number++;if(myarraySum(occ[Question.a-1])==12){ttables.splice(ttables.indexOf(Question.a),1);$("#row_"+Question.a).css("border","1px solid yellow");if(typeof ttables=="undefined"||ttables.length==0){finished();fini=1}}if(fini!=1){olda=Question.a;oldb=Question.b;Question.b=(Math.floor((Math.random()*10)+1)+Question.a)%12+1;Question.a=ttables[Math.floor((Math.random()*ttables.length))];while(occ[Question.a-1][Question.b-1]==1||(qremain>1&&olda==Question.a&&oldb==Question.b)){Question.b=Math.floor((Math.random()*12)+1);Question.a=ttables[Math.floor((Math.random()*ttables.length))]}Question.ans=Question.a*Question.b;Question.q="Qu "+Question.number+":  What is "+Question.b+" x "+Question.a+" ? ";$("#sum").text(Question.q)}}$("#answerbox").focus().val("")};