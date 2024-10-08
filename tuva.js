//global vars for user choices -- all should be read from cookie if found
var triedcookie = true;
var numbers = [];
var ops = []
var plus = 0;
var minus = 0;
var times = 1;
var divide = 0;
var teens = 0;
var larger = 0;
var level = 5;
var choice_init = false;
var game_init = false;
var username = "";
var results;
var otables = new Array();
//// global vars to store questions etc
var init = false;
var starttime = new Date();
var lasttime = new Date();
var timelevel = 60000/Math.pow(1.5,level-1);
var correctans = -1;
var qnumb = 0;
var correct = 0;
var fini = false;
var roundnumb = 12;
var noanswer = false;
var fadetime = 500;

function setquestions(){
//set level + time for level
    level = parseInt($("#levelchoice").val(),10);
    if(level<=0||isNaN(level)) level = 1;
    if(level>10) level=10;
        $("#levelchoice").val(level);
    starttime = new Date();
    lasttime = new Date();
    correctans = -1;
    qnumb = 0;
    correct = 0;
    fini = false;
    timelevel = 60000/Math.pow(1.5,level-1); //Level 1 = 60 secs per question Level 10 = 1 5 secs
    fadetime = min(timelevel/10,300);
    if($(".symb.clicked").length===0)	$("#times").addClass("clicked");
//grab operations to use
    if($("#plus").hasClass("clicked")) plus = 1;
    else plus = 0;
    if($("#minus").hasClass("clicked")) minus = 1;
    else minus = 0;
    if($("#times").hasClass("clicked")) times=1;
    else times=0;
    if($("#divide").hasClass("clicked")) divide=1;
    else divide=0;
    teens=$("#numb_11").hasClass("clicked");
    larger=$("#numb_12").hasClass("clicked");
    if(larger&&(plus+minus>0)) timelevel*=2;
   //get numbers to use make sure there are some
    if($(".numb.clicked").length===0){
	$(".numb").addClass("clicked");
    }
    if(plus==1||minus==1){
	$("#numb_11").text("11-19").addClass("smallnumb");
	$("#numb_12").text("11-99").addClass("smallnumb");
    }
    else{
	$("#numb_11").text("11").removeClass("smallnumb");
	$("#numb_12").text("12").removeClass("smallnumb");
    }
    ops=[0,0,0,0];
    if(plus) ops[0]=1;
    if(minus) ops[1]=1;
    if(times) ops[2]=1;
    if(divide) ops[3]=1;
    opsstr=ops.join(",");
    numbersstr=numbers.join(",");
    numbers=[];
    $(".numb.clicked").each(function(){
	numbers.push(parseInt((this).id.substring(5)));
    });
    numbersstr=numbers.join(",");
    // if(username!=null&&username!=""){
	// setCookie("numbers"+username,numbersstr,365);
	// setCookie("level"+username,level,365);
	// setCookie("ops"+username,opsstr,365);
    // }
    if((plus||minus)&&($(".numb.clicked").not(".smallnumb").length===0)){
	$(".numb").not('.smallnumb').addClass("clicked");
    }
    $(".prog").removeClass("question");
    $(".progbord").css("color","yellow");
    $(".progrow").css("border","1px solid black").show();
    $(".numb.clicked").each(function(){
	istr=((this).id).substring(5);
	$(".prog[id^=square"+istr+"_]").addClass("question");
	$(".progrow[id='row_"+istr+"']").show();
	$(".progbord[id^=square"+istr+"_]").css("color","red");
    //	    $(".progrow[id^='row_"+istr+"']").hide();
    });
    $(".numb:not(.clicked)").each(function(){
	istr=((this).id).substring(5);
	$(".progrow[id='row_"+istr+"']").hide();
    });
    ///make sure board is correct size for ops
    if(plus||minus){
	$(".prog.bignumb").removeClass("question");
	$(".progbord.bignumb").css("color","black");
	$("#row_11").hide();
	$("#row_12").hide();
    }
    

	    
//ask first question
    randomquestion();
}

function randomquestion(){
    var    qremain=$(".question").length;
    if($(".currentquestion.question").length>0) qremain--;
    if(qremain>0){
	$(".currentquestion").addClass("lastquestion").removeClass("currentquestion");
	var	nextq= Math.floor(Math.random()*qremain);
	$(".question:not(.lastquestion)").slice(nextq,nextq+1).addClass("currentquestion");
	$(".lastquestion").removeClass("lastquestion");
    }
    else{
	$(".currentquestion").removeClass("currentquestion");
	$(".question").addClass("currentquestion");
    }
    var numbstr=$(".currentquestion").attr("id").substring(6);
    var ab=numbstr.split("_");
    var a=parseInt(ab[0]);
    var b=parseInt(ab[1]);
    var randchoice=0.5-Math.random();
    if(times || divide){
	if((times && !divide)||(times&&divide&&(randchoice>0))){
	    qstr=b+ " &times " + a+ " = ";
	    correctans=a*b;
	}
	
	else{
	    qstr=a*b+" &divide " + a + " = ";
	    correctans=b;
	}
    }
    else{//now if plus and/or minus section
	if(teens){
	    b+=Math.floor(Math.random()*2)*10;
	    a+=Math.floor(Math.random()*2)*10;
	    }
	if(larger){
	    b+=Math.floor(Math.random()*10)*10;
	    a+=Math.floor(Math.random()*10)*10;
	}
	if((plus && !minus)||(plus&&minus&&(randchoice>0))){
	    qstr=b+ " + " +a+ " = ";
	    correctans=a+b;
	}
	else{
	    var x=max(a,b);
	    var y=min(a,b);
	    qstr= x+" &#8722 "+ y + " = ";
	    correctans=x-y;
	}
    }
    var canswer=String(correctans);
    $("#answerbox").prop("maxlength",canswer.length);
    $("#disquestion").html(qstr);
    $("#answerbox").focus();
}


function initialize(){
    gridstr="";
    for(var i=1;i<=3;i++){
	gridstr+="<div class='numbrow' id='numbrow_"+i+"'>";
	for(var j=1;j<=4;j++)   gridstr+="<div class='numb' id='numb_"+((i-1)*4+j)+"'>"+((i-1)*4+j)+"</div>";
	gridstr+="</div>";
    }
    gridstr+="<div class='numbrow' id='symbrow'><div id='plusminus' class='symbpair'><div class='symb' id='plus'>+</div><div class='symb' id='minus'>&#8722</div></div><div id='timesdivide' class='symbpair'><div class='symb' id='times'>&times</div><div class='symb' id='divide'>&divide</div></div></div>";
    gridstr+="<div  id='leveldiv'>Level<input class='inputbox' type='tel'id='levelchoice' value='"+level+"'/></div>";
    gridstr+="<div id='choicedone' onClick='gameplay()'>Play</div>";
//    gridstr+="<div id='changebutchoice' onclick='changeuser()' style='color:cyan;font-size:15px;cursor:pointer;'>New Player?</div>";
    $("#choice").html(gridstr);
    $("#choicedone").focus();

//gameplay build
// score + timer top row
    scorestr="<div class='textrow' id='scoreandtime' ><div id='score' class='left' style='width:75%'>0/0</div><div id='stopwatch' class='right' style='color:#FF0000;width:25%;text-align:center;'>0.0</div></div>";

// question + answer box 2nd row

    qandastr="<div id='disquestion' class='textrow' style='width:240px;float:left;text-align:right;'>?? + ?? = </div><div><input type='tel' class='inputbox' id='answerbox'/></div>";

/// comment 3rd row
    commentstr="<div id='comment' class='textrow,left'>Go!</div>";

// progress record

    progstr="<div id=#progress>";
    for (var i=0;i<roundnumb+1;i++){
	progstr=progstr+"<div class='progrow' id='row_"+i+"'>";
	for (var j=0;j<roundnumb+1;j++){
	    if(i>0 && j>0) progstr=progstr+"<div class='prog' id='square"+i+"_"+j+"'></div>";
	    if(i==0&&j>0)  progstr=progstr+"<div class='progbord' id='square"+i+"_"+j+" value='"+j+"'>"+j+"</div>";
	    if(i>0&&j==0) progstr=progstr+"<div class='progbord' id='square"+i+"_"+j+"'>"+i+"</div>";
	    if(i==0&&j==0) progstr=progstr+"<div class='progbord' id='square"+i+"_"+j+"'>O</div>";
	}
	progstr=progstr+"</div>";	
    }
    progstr+="</div>";
    restartstr="<div id='restart' onclick='choice()' class='clickable' style='width:100px;line-height:100px;margin-left:auto;margin-right:auto;display:block'>Quit</div>";	  

//make page
    gamestr=scorestr+qandastr+commentstr+progstr+restartstr;
    $("#gameplay").html(gamestr);
//
    $(".prog[id*='11'], .progbord[id*='11']").addClass("bignumb");
    $(".prog[id*='12'], .progbord[id*='12']").addClass("bignumb");

//set answerbox input to only accept correct answers and make it easy to get focus on answerbox
    $('#answerbox').keyup(function(e) {
	if($("#answerbox").val()!=""&&parseInt($("#answerbox").val(),10)===correctans&&!noanswer){
	    $("#comment").finish().css('visibility','visible').text("Correct!").fadeTo(0,1).fadeTo(min(timelevel/2,2000),0.08);
	    noanswer=true;
	    $("#answerbox").css("color","lawngreen").fadeOut(fadetime, function() {
		answered(true);
	    });
	}
	else{
	    if(e.keyCode==13){
		var enterinp=parseInt($("#answerbox").val(),10);
		if(!isNaN(enterinp)&&!noanswer){
		    noanswer=true;
		    $("#comment").finish().css('visibility','visible').text("Wrong! "+$("#disquestion").text()+correctans).fadeTo(0,1).fadeTo(timelevel,0.3);
		    $("#answerbox").css("color","red").fadeOut(fadetime, function() {
			answered(false);
		    });
		    
		}
		else $("#answerbox").val("");
	    }
	}
    });
//    


// set values if given
    if(numbers.length>0){
	for(var i=0;i<numbers.length;i++){
	    $("#numb_"+numbers[i]).addClass("clicked");
	    $(".progbord[id=square"+numbers[i]+"_0]").css("color","red");
	    $(".prog[id^=square"+numbers[i]+"_]").addClass("question");
	}
    }	
    if(ops.length==4){
	plus=ops[0];
	minus=ops[1];
	times=ops[2];
	divide=ops[3];
	if(plus==1)	$("#plus").addClass("clicked");
	else $("#plus").removeClass("clicked");
	if(minus==1) $("#minus").addClass("clicked");
	else $("#minus").removeClass("clicked");
	if(plus==1||minus==1){
	    $("#numb_11").text("11-19").addClass("smallnumb");
	    $("#numb_12").text("11-99").addClass("smallnumb");
	}
	else{
	    $("#numb_11").text("11").removeClass("smallnumb");
	    $("#numb_12").text("12").removeClass("smallnumb");
	}
	if(times==1) $("#times").addClass("clicked");
	else $("#times").removeClass("clicked");
	if(divide==1) $("#divide").addClass("clicked");
	else $("#divide").removeClass("clicked");
    }
    $('#levelchoice').spinner({
        min: 1,
        max: 10,
        step: 1,
	page: level,
    });


// add cross page functionality

    
    $(".symbpair").click(function(){
	$(".symbpair").not(this).children().removeClass("clicked");
	if((this).id==="plusminus"){
	    $("#numb_11").text("11-19").addClass("smallnumb");
	    $("#numb_12").text("11-99").addClass("smallnumb");
	    if($(".smallnumb.clicked").length===2) $("#numb_11").removeClass("clicked");
	}
	else{
	    $("#numb_11").text("11").removeClass("smallnumb");
	    $("#numb_12").text("12").removeClass("smallnumb");
	}
    });
    $(".numb").click(function(){
	$(this).toggleClass("clicked");
	if($(this).is(".smallnumb.clicked")){
	    $(".smallnumb").not(this).removeClass("clicked");
	}
	$("#choicedone").focus();
    });
    $(".symb").click(function(){
	$(this).toggleClass("clicked");
    });
    

    return true;
}

    


function changepage(newpage){//switch to newpage given #pageid 
    $(".page").hide();
    $(newpage).show();
}




function welcome(){
    changepage("#welcome");
    checkCookie();
}
// build and display (or just display) the choice page
function choice(){
    //if(!init) 
    init=initialize();
    changepage("#choice");
    $("#records").remove();
}

function gameplay(){
  
    changepage("#gameplay");
    // if(username!=null&&username!=""){
	// setCookie("level"+username,level,365);
	// setCookie("numbers"+username,numbers.join(","),365);
	// setCookie("ops"+username,ops.join(","),365);
    // }
    setquestions();
    setInterval(updateTime, 66); // every 15th second call updateTime 
    gamereset();
}


function answered(answer){
    noanswer=false;
    curtime=new Date();
    speed=curtime-lasttime;
    lasttime=curtime;
    qnumb++;
    if(answer){
	correct++;
	$("#score").text("L "+level+": "+correct+"/"+qnumb);
	$(".currentquestion").css("background-color",getColour(speed));
	if(speed<timelevel){
	    var $par=$(".currentquestion").parent();
	    $(".currentquestion").removeClass("question");
	    if ($par.children().filter(".question").length===0) $par.hide("fade","slow");
	    if($(".question").length===0) fini=true;
	}
    }
    else{
	$("#score").text("L "+level+": "+correct+"/"+qnumb);
	$(".currentquestion").css("background-color","black");
    }
    $("#answerbox").val("").css("color","orange").show().focus()
    if(!fini) randomquestion();  
    else finished();
}

function finished(){
    $("#gameplay").hide("fade","slow",oldfinished());// "explode",{pieces: 16}, 1000,oldfinished());
//    $("#gameplay").hide( "explode",{pieces: 16}, 1000,oldfinished());
    //$("#comment").hide();
   // $("#comment").text("Complete!").fadeIn("slow");
}

function gamereset(){
    qnumb=0;
    fini=false;
    correct=0;
    $("#score").text("L "+level+": 0/0 ").show();
    $("#comment").fadeTo(0,1).text("Go!");
    $("#answerbox").focus();
    $(".prog").css("background-color","black");
    if(times) $("#square0_0").html("&times");
    if(divide&&!times) $("#square0_0").html("&divide");
    if(plus) $("#square0_0").html("+");
    if(minus&&!plus) $("#square0_0").html("&#8722");
    $("#progress").show();
}



function updateTime(){
    var actime=new Date()-lasttime;
    secs=parseInt(actime)/1000;
    digits=1;
    if(secs>60) digits=0;
    $('#stopwatch').css("color",getColour(actime)).text(secs.toFixed(digits)).show()
}

// set color according to timeelapsed
function getColour(x,y){
    if (y==0) return "#000000";//i.e. wrong answer
    if(x < timelevel) return "red";// "#FF0000";
    if(x <2*timelevel) return "orange";//"#FFCC00";
    if(x <3.5*timelevel) return "yellow";//"#FFFF00";
    if(x <6*timelevel) return "lime";//"#66FF00";
    if(x <9*timelevel) return "blue";// "#00CCFF";
    return "indigo";// "#0000FF";//slowest possible
}


function max(a,b){
    if (a>b) return a;
    return b;
}

function min(a,b){
    if (a>b) return b;
    return a;
}

function buildgame(page){
    return true;
}

//to randomize array use array.sort(randsort);
function randsort(){
    return 0.5-Math.random();
}
//to sort numeric array use array.sort(numeric);
function numeric(a,b) {
    return a - b;
}





function capital(string){
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function displayRes(results){
    $("#results").hide();
    $("#welcome").text("");
    changepage("#welcome");
    var prefix = ""//"Times tables ";
    var resstr=""
    if(results!=""&&results!=null){
	restr="<div id='records'><p style='color:#FF0000;text-align:center;'>Welcome back "+capital(username)+"</p>";
    }
    else{
	resstr="<div id='records'><p style='color:#FF0000;text-align:center;'>Hello "+capital(username)+"</p>";
    }
    resstr+="<div id='recordbut' onclick='choice()'>Play</div>";
//    resstr+="<div id='changebut' onclick='changeuser()'>New Player?</div>";
    if(results!==null && results!=""){
	var newresults=results.replace(/ddd/gi,"ttu");
	var resarray=newresults.split(":");
	var indres=new Array();
	for (var j=0;j<resarray.length/2;j++){
	    indres[j]="";
	    indres[j]+=resarray[2*j]+":"+resarray[2*j+1];
	}
	indres.sort();
	indstr=indres.join(":");
	resarray=indstr.split(":");
//	resstr="<div id='records'><p style='color:#FF0000;text-align:center;'>"+capital(username)+"'s records:</p>";
//	resstr+="<div id='recordbut' onclick='choice()'>Play</div>";
	// resstr+="<div id='changebut' onclick='changeuser()'>New Player?</div>";
	for (var i=0;i<resarray.length/2;i++){
	    var cur=resarray[2*i].split(",");
	    curpre=cur.shift();
	    switch(curpre){
	    case "ttt":
		prefix="Times tables ";
		break;
	    case "ttu":
		prefix="Division tables ";
		break;
	    case "ttv":
		prefix="Times and division tables ";
		break;
            case "ttw":
		prefix="Addition ";
		break;
	    case "ttx":
		prefix="Subtraction ";
		break;
	    case "tty":
		prefix="Addition and subtraction ";
	    default: 
	    }
	    resstr+=prefix;
	    while (cur.length>1){
		nextnumb=cur.shift();
		if(curpre==="ttw"||curpre==="ttx"||curpre==="tty"){
		    if(nextnumb=="11") nextnumb="teens";
		    if(nextnumb=="12") nextnumb="tens to a hundred";
		}
		resstr+=nextnumb;
		resstr+=", ";
	    }
//	    resstr=resstr+" on level "+cur[0]+". Time: "+resarray[2*i+1]+"<br>";
	}
    }
    resstr+="</div>";
    $("#welcome").html(resstr).show();
    $("#recordbut").focus();   
}

function changeuser(){
//    triedcookie=false;
//added
    changepage("#welcome");
    $("#records").remove();
    username="Tuva"
    // setCookie("username",username,365);
    // checkCookie();
}


function getCookie(c_name){
    // var c_value = document.cookie;
    // var c_start = c_value.indexOf(" " + c_name + "=");
    // if (c_start == -1)
    // {
	// c_start = c_value.indexOf(c_name + "=");
    // }
    // if (c_start == -1)
    // {
	// c_value = null;
    // }
    // else
    // {
	// c_start = c_value.indexOf("=", c_start) + 1;
	// var c_end = c_value.indexOf(";", c_start);
	// if (c_end == -1)
	// {
	//     c_end = c_value.length;
	// }
	// c_value = unescape(c_value.substring(c_start,c_end));
    // }
    return "Tuva";
}

// function setCookie(c_name,value,exdays){
//     var exdate=new Date();
//     exdate.setDate(exdate.getDate() + exdays);
//     var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
//     document.cookie=c_name + "=" + c_value + ";domain=.tuva.org.uk;path=/";
//     document.cookie=c_name + "=" + c_value + ";domain=127.0.1.1;path=/";
//     document.cookie=c_name + "=" + c_value + ";domain=192.168.0.3;path=/";
//     document.cookie=c_name + "=" + c_value + ";domain=192.168.0.2;path=/";
// }

function setname(){
    username="Tuva"//$("#namebox").val();
//     username=username.toLowerCase();
//     username = username.replace(/ /g,'');
//     if(username !=null && username !="" && username.length<30){
// 	triedcookie=true;
// //	setCookie("username",username,365);
// //	choice();
// //	checkCookie();
//     }
//     else $("#namebox").val("");
}

function checkCookie(){
    if(!triedcookie) username=getCookie("username");
    if ((username==null || username=="")&&!triedcookie)
    {
//	getname="<div id='records'><p style='color:#FF0000;text-align:center;'>Please enter a username:</p><div style='text-align:center'><input type='text' class='inputbox' id='namebox'  style='width:250px;'/><p>(This is only needed so you can see your results later. Your results are only stored on your computer.)</p><button id='namebut' onClick='setname()' style='display:none' >Go!</button></div></div>";
	$("#welcome").html(getname);
	$("#namebox").focus();
	$("#namebox").keydown(function(event){
	    if (event.which == 13) document.getElementById('namebut').click();
	    
	});
	$("#namebox").blur(function(event){
	    document.getElementById('namebut').click(); 
	});
    }
    else{
	if(username==null||username=="") username="Anonymous";
	username=username.toLowerCase();
	username = username.replace(/ /g,'');
	results=getCookie("results"+username);
	level=parseInt(getCookie("level"+username));
	if(level==null||isNaN(level)||level<0) level=5;
	if(level>30) level=30;
	numbersstr=getCookie("numbers"+username);
	if(numbersstr==null||numbersstr=="") numbersstr="6,9,11";
	numbers=numbersstr.split(",");
	opsstr=getCookie("ops"+username);

	if(opsstr==null||opsstr=="") opsstr="0,0,1,0";
	ops=opsstr.split(",");
	displayRes(results);
    }
}


function oldfinished(){
    timetaken=new Date();
    timetaken-=starttime;
    timetaken/= 1000;
    otables.length=0;
    $(".numb.clicked").each(function(){
	otables.push(parseInt(((this).id).substring(5)));
    });
    otables.sort(numeric);
    stables=" "+otables[0];
    for (var i=1;i<otables.length-1;i++){
	stables=stables+", "+otables[i];
    }
    if(otables.length>1){
	stables=stables+ " and " + otables[otables.length-1];
	if(plus||minus){
	//replace 11 and 12 by teens and larger
	    stables=stables.replace("11","teens");
	    stables=stables.replace("12","tens to hundred");
	}
	stables="You completed level " + level + " of your" +stables;
	if(times&&!divide) stables+=" times tables in "+ timetaken.toFixed(1) + " seconds."; 
	if(!times&&divide) stables+=" division tables in "+ timetaken.toFixed(1) + " seconds."; 
	if(times&&divide) stables+=" times and division tables in "+ timetaken.toFixed(1) + " seconds.";
	if(plus&&!minus) stables+=" addition in "+ timetaken.toFixed(1) + " seconds.";  
	if(!plus&&minus) stables+=" subtraction in "+ timetaken.toFixed(1) + " seconds."; 
	if(plus&&minus)  stables+=" addition and subtraction in "+ timetaken.toFixed(1) + " seconds."; 
    }
    else{
	if(times&&!divide) stables="You completed level "+ level + " of your" + stables+ " times table in "+ timetaken.toFixed(1) + " seconds.";  
	if(!times&&divide)  stables="You completed level "+ level + " of your" + stables+ " division table in "+ timetaken.toFixed(1) + " seconds.";  
	if(times&&divide)  stables="You completed level "+ level + " of your" + stables+ " times and division table in "+ timetaken.toFixed(1) + " seconds.";  
	if(plus&&!minus) stables="You completed level "+ level + " of your" +stables+ " addition in " + timetaken.toFixed(1) + " seconds.";  
	if(!plus&&minus) stables="You completed level "+ level + " of your" +stables+ " subtraction in " + timetaken.toFixed(1) + " seconds.";  
	if(plus&&minus)  stables="You completed level "+ level + " of your" +stables+ " addition and subtraction in " + timetaken.toFixed(1) + " seconds.";  
    }
    stables+="</div><br><div id='replaybut' onclick='displayRes(results)' style='visibility:visible;'>Play</div>";
    $("#results").html("<div id='theseresults'>"+stables).fadeIn(3000);
    $("#replaybut").focus();
//    results="";
    var current="ttt,";
    if(divide&&!times) current="ttu,";
    if(divide&&times) current="ttv,";
    if(plus&&!minus) current="ttw,";
    if(!plus&&minus) current="ttx,";
    if(plus&&minus) current="tty,";
    current=current+otables.join()+","+level;
    var  oldresults=getCookie("results"+username);
    if (oldresults!=null && oldresults!=""){
	var oldresarray=oldresults.split(":");
	var p=oldresarray.indexOf(current);
	if(p>=0&&parseFloat(oldresarray[p+1])>timetaken){
	    $("#results").prepend("<p>New personal best!</p>");
	    oldresarray[p+1]=timetaken.toFixed(1);
	    results=oldresarray.join(":");
	 //   setCookie("results"+username,results,365);
	}
	if(p<0){
	    results=oldresults+":"+current+":"+timetaken.toFixed(1);
	 //   setCookie("results"+username,results,365);
	}
    }
    else{
	results=current+":"+timetaken.toFixed(1);
	//setCookie("results"+username,results,365);
    }
}