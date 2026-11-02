
var player = 1;
var playeronepos = 0;
var playertwopos = 0;
var newpos = 0;
var animpos = 0;
var myhtmldigit = 6;
var myhtmldigits = 6;
var dicevalue = 6;
var dicevalues = 6;
var dicevalues = 6;
var diceframe = 0;
var diceframes = 0;
var pogw = 0;
var ptgw = 0;
var winpattern = [01, 10, 91, 20, 12, 92, 21, 28, 93, 40, 34, 94, 41, 46, 95, 60, 56, 96, 61, 64, 97, 80, 78, 98, 81, 82, 99, 100, 0, 0];
var wpf = 0;
var spin = 0;
var myreel = 0;
var reeltimecounter = 0;
var startingBlock = 6;
var buttonclicked = 1;
var reelnumber = [0, 0, 0];     //numbers that land on the line
var myArray = [4,5,6,1,2,3,4,5,6,1,2,3,4,5,6,1,2,3,4,5,6,1,2,3,4,5,6,1,2,3,4,5,6];
var linetotal = 0;
var anum = 0;
var reelposttemp = 0;
var mySwitch = 0;
var switchCounter = 0;
var myWait = 0;
var itsDone = 0;
var clearoneoff = 1;
var backnote = 0;
var endWait = 0;
var diceframes = 0;
var backnotes = 0;
var sidspintimer = 0;
var rollinprocess = 0;
var theswitch = 0;

$(function() {

		if ($(window).width() > 980) {
		changescreen();
}

	if (player == 1) $(".rollthedice").addClass("pressgo");

	var audioElementPos = document.createElement('audio');
    audioElementPos.setAttribute('src', 'https://www.stezzer.com/b/audio/pos1.ogg');


	var audioElementDice = document.createElement('audio');
    audioElementDice.setAttribute('src', 'https://www.stezzer.com/b/audio/dice.ogg');

   	var audioElementSnake = document.createElement('audio');
    audioElementSnake.setAttribute('src', 'https://www.stezzer.com/b/audio/wahwah.ogg');

   	var audioElementReel = document.createElement('audio');
    audioElementReel.setAttribute('src', 'https://www.stezzer.com/b/audio/reel.ogg');

   	var audioElementReels = document.createElement('audio');
    audioElementReels.setAttribute('src', 'https://www.stezzer.com/b/audio/reels.ogg');

   	var audioElementDance = document.createElement('audio');
    audioElementDance.setAttribute('src', 'https://www.stezzer.com/b/audio/dance.ogg');

   	var audioElementSpin = document.createElement('audio');
    audioElementSpin.setAttribute('src', 'https://www.stezzer.com/b/audio/woo.ogg');

   	var audioElementLoser = document.createElement('audio');
    audioElementLoser.setAttribute('src', 'https://www.stezzer.com/b/audio/loser5.ogg');


	$(".atthestart").click (function() {
		$(".atthestart").css("display","none");
	});
	$(".playingonpc").click (function() {
		changescreen();
	});
	$(".rollthedice").click (function() {
		if ((player == 1) && (rollinprocess == 0)) {rollinprocess = 1; throwdice();}
	});
	$(".spin").click (function() {
		if ((player == 1) && (spin == 1)) {mySwitch = 1; $("button.spin").removeClass("pressgo"); spin = 0; spinreels();}
	});
	

	function changescreen() {

	$(".mycontainer").css("transform","scale(0.7)");
	$(".mycontainer").css("top","-150px");
	$(".mycontainer").addClass("overflowdesktop");
	}
	
	
	function changeplayer() {

	if (player == 2) {

	player = 1;
	$(".playertwocontainer").removeClass("dimcontainer").addClass("lightupcontainer");
	$(".playeronecontainer").removeClass("lightupcontainer").addClass("dimcontainer"); 	
	
	$(".pone").text(playeronepos);
	$("button.rollthedice").removeClass("pressgo");

	for (var i = 0; i < 101; i++) {
		$(".a" + i).removeClass("litup").removeClass("running").addClass("static");
	}

	for (var i = 0; i < playeronepos; i++) {
		$(".a" + i).removeClass("static").addClass("litup");
	}
		$(".a" + playeronepos).removeClass("static").removeClass("litup").addClass("running");
		$("button.rollthedice").addClass("pressgo");}
		

	else { 

	player = 2;
	$(".playeronecontainer").removeClass("dimcontainer").addClass("lightupcontainer");
	$(".playertwocontainer").removeClass("lightupcontainer").addClass("dimcontainer"); 
	
	$(".ptwo").text(playertwopos);

	for (var i = 0; i < 101; i++) {
		$(".a" + i).removeClass("litup").removeClass("running").addClass("static");
	}

	for (var i = 0; i < playertwopos; i++) {
		$(".a" + i).removeClass("static").removeClass("running").addClass("litup");
	}
		$(".a" + playertwopos).removeClass("static").removeClass("litup").addClass("running");
	
		$(".rollthedice").removeClass("pressgo");
		playertwo();

	}
	
};



function sidspin() {
	
 	var sidsp = setInterval(sidspincode, 50);
 	
 	$(".sid").css("display","none");
 	$(".sideyes").css("display","none");
 	$(".sidblink").css("display","none");
 	$("button.rollthedice").removeClass("pressgo");
 	player = 2;

 	sidspintimer = 0;


 	function sidspincode() {

 		sidspintimer++;

 		if (sidspintimer == 1) {$(".sidspin").css("display" , "block"); $(".spinsid").addClass("pressgo");}

		if (sidspintimer == 2) {
			$(".sidspin").css("display","block").addClass("sidspinreels");

			$(".rollthedicesid").removeClass("pressgo"); 	
			$("button.rollthedice").removeClass("pressgo");}
		
		if (sidspintimer == 25) 	{$("button.rollthedicesid").removeClass("pressgo"); $("button.spinsid").removeClass("pressgo");}


		if (sidspintimer == 35) 	$(".sidblinkspin").css("display","block");

		if (sidspintimer == 38) 	$(".sidblinkspin").css("display","none");

		if (sidspintimer == 50) 	$(".sidblinkspin").css("display","block");

		if (sidspintimer == 53) 	$(".sidblinkspin").css("display","none");

		if (sidspintimer == 55) 	$(".sideyesspin").css("display","block");

		if (sidspintimer == 59) 	$(".sideyesspin").css("display","none");
	
		if (sidspintimer == 65) 	{$(".sidspin").css("display", "none").removeClass("sidspinreels"); 
			$(".sideyesspin").css("display" , "none");
			$(".sidblinkspin").css("display" , "none");


		clearInterval(sidsp); sidspintimer = 0; spinreels();}






 	}
 };


function clearafterwin() {

 	var clearafterwintimer = setInterval(clearafterwincode, 50);
 	
 	function clearafterwincode() {

 		if (diceframe == 0) $(".a100").addClass("litup");
 		
 		diceframe++;

 	//	if (diceframe == 50) {

 	//		for (var i = 0; i < 101; i++) {
	//		$(".a" + i).removeClass("litup").removeClass("running").addClass("redwin");
	//	}}

	//$(".a" + animpos).addClass("staticfade");

	if ((player == 1) && (clearoneoff == 1)) {$(".pone").text("0"); $(".ponewin").css("display" , "block"); clearoneoff = 0;}
	if ((player == 2) && (clearoneoff == 1)) {$(".ptwo").text("0"); $(".ptwowin").css("display" , "block"); clearoneoff = 0;}

	//console.log("clearafterwin");

	//$(".a" + winpattern[wpf + 0]).addClass("redwin");		
	//$(".a" + winpattern[wpf + 1]).addClass("redwin");
	//$(".a" + winpattern[wpf + 2]).addClass("redwin");	

	//wpf += 3;

	//if (wpf > 30) wpf = 0;

	if (diceframe == 20) {


		$(".a100").removeClass("litup").addClass("static");
		clearInterval(clearafterwintimer);

		$(".ponewin").css("display" , "none");
		$(".ptwowin").css("display" , "none");

		for (var i = 0; i < 101; i++){
			$(".a" + i).removeClass("litup").removeClass("running").addClass("static");
		}

		if (player == 1) {pogw++; playeronepos = 0; player = 2; playertwopos = 0; newpos = 0; backnote = 0; backnotes = 0; $(".gameswonone").text(pogw); playertwopos = 0; diceframe = 0; diceframes = 0; changeplayer();}
		if (player == 2) {ptgw++; playertwopos = 0; player = 1; playeronepos = 0; newpos = 0; backnote = 0; backnotes = 0; $(".gameswontwo").text(ptgw); playeronepos = 0; diceframe = 0; diceframes = 0; changeplayer();}
	
		diceframe = 0;
		diceframes = 0;
		
	}
	}
		player = 1; 
		$("button.rollthedice").addClass("pressgo");
};

function throwdice() {

	$("button.rollthedice").removeClass("pressgo");

 var dicetimer = setInterval(dicecode, 100);
	function dicecode() {
	
	diceframe++;

	if (diceframe < 6) {

	dicevalue = (Math.floor(Math.random()*6) + 1);

	$('div.d' + (myhtmldigit)).replaceWith('<div class="d' + (dicevalue) + '"></div>');

	if (diceframe == 1) {audioElementDice.play(); $(".diceone").removeClass("diceout").addClass("dicethrow");}
	
	myhtmldigit = dicevalue;

}
	if (diceframe == 6) {audioElementDice.currentTime = 0;

		$(".diceone").removeClass("dicethrow").addClass("diceout");

	}
	if (diceframe == 12) {	
	
	if (player == 1) {newpos = playeronepos + dicevalue; endWait = 14;
		if (newpos > 100) {backnote = newpos - 100; newpos = 100 - backnote; }
		clearInterval(dicetimer); diceframe = 0; updateboard();}

//	if (player == 2) {newpos = playertwopos + dicevalue; endWait = 14;
//		if (newpos > 100) {backnotes = newpos - 100; newpos = 100 - backnotes; }
//		clearInterval(dicetimer); diceframe = 0; updateboard();}

		}
	}
}

function sidthrowdice() {


 var dicetimers = setInterval(dicecodes, 100);
	function dicecodes() {
	
	diceframes++;

	if (diceframes < 6) {

	dicevalues = (Math.floor(Math.random()*6) + 1);

	$('div.ds' + (myhtmldigits)).replaceWith('<div class="ds' + (dicevalues) + '"></div>');

	if (diceframes == 1) {audioElementDice.play(); $(".dicetwo").removeClass("diceout").addClass("dicethrow");}
	
	myhtmldigits = dicevalues;

}
	if (diceframes == 6) {audioElementDice.currentTime = 0;

		$(".dicetwo").removeClass("dicethrow").addClass("diceout");

	}
	if (diceframes == 12) {	
	
	
	
	newpos = playertwopos + dicevalues; myWait = 2; endWait = 14;
		if (newpos > 100) {backnotes = newpos - 100; newpos = 100 - backnotes; }
		
		diceframes = 0;
		$(".dicetwo").removeClass("diceout");
		clearInterval(dicetimers);
		
				
		updateboard();
		}
	}
}


function updateboard() {

 var boardupdater = setInterval(boardcode, 120);


	function boardcode() {

		//console.log(spin);

		if (myWait > 0) myWait--;


		if ((player == 1) && (newpos == playeronepos) && (endWait > 0)) endWait--;
		if ((player == 2) && (newpos == playertwopos) && (endWait > 0)) endWait--;


		if ((player == 1) && (newpos > playeronepos) && (myWait == 0)) {
		
			$(".a" + playeronepos).removeClass("running").removeClass("static").addClass("litup");
			
			audioElementPos.currentTime = 0;
			audioElementPos.play();

			playeronepos++; 

			$(".pone").text(playeronepos);
			$(".gameswonone").text(pogw);
		}

		if ((player == 1) && (newpos < playeronepos) && (myWait == 0)) {
			
			$(".a" + playeronepos).removeClass("litup").removeClass("running").addClass("static");
			
			playeronepos--; 

			$(".pone").text(playeronepos);
			$(".gameswonone").text(pogw);
		}


		if ((player == 2) && (newpos > playertwopos) && (myWait == 0)) {


		
			$(".a" + playertwopos).removeClass("running").addClass("litup");
			
			audioElementPos.currentTime = 0;
			audioElementPos.play();

			playertwopos++; 

			$(".ptwo").text(playertwopos);
			$(".gameswontwo").text(ptgw);
		}

		if ((player == 2) && (newpos < playertwopos) && (myWait == 0)) {


		
			$(".a" + playertwopos).removeClass("running").removeClass("litup").addClass("static");
			


			playertwopos--; 

			$(".ptwo").text(playertwopos);
			$(".gameswontwo").text(ptgw);
		}

		if ((endWait == 0) && (spin == 1) && (playeronepos == 14)) {clearInterval(boardupdater); spin = 0; $("button.spin").addClass("pressgo"); $("button.rollthedice").remove("pressgo");

		audioElementSpin.currentTime = 0;
		audioElementSpin.play();		
		}
		
		if ((endWait == 0) && (spin == 1) && (playeronepos == 17)) {clearInterval(boardupdater); spin = 0; $("button.spin").addClass("pressgo"); $("button.rollthedice").remove("pressgo");
		audioElementSpin.currentTime = 0;
		audioElementSpin.play();
		}
		
		if ((endWait == 0) && (spin == 1) && (playeronepos == 32)) {clearInterval(boardupdater); spin = 0; $("button.spin").addClass("pressgo"); $("button.rollthedice").remove("pressgo");
		audioElementSpin.currentTime = 0;
		audioElementSpin.play();		
		}

		if ((endWait == 0) && (spin == 1) && (playeronepos == 43)) {clearInterval(boardupdater); spin = 0; $("button.spin").addClass("pressgo"); $("button.rollthedice").remove("pressgo");
		audioElementSpin.currentTime = 0;
		audioElementSpin.play();		
		
		}
		
		if ((endWait == 0) && (spin == 1) && (playeronepos == 69)) {clearInterval(boardupdater); spin = 0; $("button.spin").addClass("pressgo"); $("button.rollthedice").remove("pressgo");

		audioElementSpin.currentTime = 0;
		audioElementSpin.play();		
		}
		
		
		if ((endWait == 0) && (spin == 1) && (playeronepos == 80)) {clearInterval(boardupdater); spin = 0; $("button.spin").addClass("pressgo"); $("button.rollthedice").remove("pressgo");
		audioElementSpin.currentTime = 0;
		audioElementSpin.play();		
		}

		if ((player == 1) && (playeronepos == newpos) && (playeronepos == 100)) {animpos = 100; clearoneoff = 1; audioElementDance.currentTime = 0;
			audioElementDance.play(); clearInterval(boardupdater); rollinprocess = 0; clearafterwin();}
		if ((player == 2) && (playertwopos == newpos) && (playertwopos == 100)) {animpos = 100; clearoneoff = 1; audioElementLoser.currentTime = 0;
			audioElementLoser.play(); clearInterval(boardupdater); rollinprocess = 0; clearafterwin();}

		if ((player == 1) && (playeronepos == newpos) && (playeronepos > 100)) {backnote = newpos; newpos = 100 - backnote; audioElementSnake.currentTime = 0;
			audioElementSnake.play();}

		if ((player == 2) && (playertwopos == newpos) && (playertwopos > 100)) {backnotes = newpos; newpos = 100 - backnotes; audioElementSnake.currentTime = 0;
			audioElementSnake.play();}

		if ((player == 1) && (playeronepos == newpos) && (playeronepos == 31)) { $(".a31").addClass("running"); newpos = 10; myWait = 10;

		endWait = 14;

		audioElementSnake.currentTime = 0;
		audioElementSnake.play();
		}

		if ((player == 2) && (playertwopos == newpos) && (playertwopos == 31)) { $(".a31").addClass("running"); newpos = 10; myWait = 10;

		endWait = 14;

		audioElementSnake.currentTime = 0;
		audioElementSnake.play();
		}

		if ((player == 1) && (playeronepos == newpos) && (playeronepos == 38)) { $(".a38").addClass("running"); newpos = 3; myWait = 10;

		endWait = 14;

		audioElementSnake.currentTime = 0;
		audioElementSnake.play();
		}
		
		if ((player == 2) && (playertwopos == newpos) && (playertwopos == 38)) { $(".a38").addClass("running"); newpos = 3; myWait = 10;

		endWait = 14;

		audioElementSnake.currentTime = 0;
		audioElementSnake.play();
		}

		if ((player == 1) && (playeronepos == newpos) && (playeronepos == 54)) { $(".a54").addClass("running"); newpos = 27; myWait = 10;

		endWait = 14;

		audioElementSnake.currentTime = 0;
		audioElementSnake.play();
		}
		if ((player == 2) && (playertwopos == newpos) && (playertwopos == 54)) { $(".a54").addClass("running"); newpos = 27; myWait = 10;

		endWait = 14;

		audioElementSnake.currentTime = 0;
		audioElementSnake.play();
		}
		if ((player == 1) && (playeronepos == newpos) && (playeronepos == 86)) { $(".a86").addClass("running"); newpos = 55; myWait = 10;

		endWait = 14;

		audioElementSnake.currentTime = 0;
		audioElementSnake.play();
		}
		if ((player == 2) && (playertwopos == newpos) && (playertwopos == 86)) { $(".a86").addClass("running"); newpos = 55; myWait = 10;

		endWait = 14;

		audioElementSnake.currentTime = 0;
		audioElementSnake.play();
		}
		if ((player == 1) && (playeronepos == newpos) && (playeronepos == 91)) { $(".a91").addClass("running"); newpos = 70; myWait = 10;

		endWait = 14;

		audioElementSnake.currentTime = 0;
		audioElementSnake.play();
		}
		if ((player == 2) && (playertwopos == newpos) && (playertwopos == 91)) { $(".a91").addClass("running"); newpos = 70; myWait = 10;

		endWait = 14;

		audioElementSnake.currentTime = 0;
		audioElementSnake.play();
		}

		if ((player == 1) && (playeronepos == newpos) && (playeronepos == 99)) { $(".a99").addClass("running"); newpos = 62; myWait = 10;

		endWait = 14;

		audioElementSnake.currentTime = 0;
		audioElementSnake.play();
		}
		if ((player == 2) && (playertwopos == newpos) && (playertwopos == 99)) { $(".a99").addClass("running"); newpos = 62; myWait = 10;
		
		endWait = 14;

		audioElementSnake.currentTime = 0;
		audioElementSnake.play();
		}

		if ((player == 1) && (playeronepos == newpos) && (endWait == 14)) { $(".a" + newpos).addClass("running"); }
		if ((player == 2) && (playertwopos == newpos) && (endWait == 14)) { $(".a" + newpos).addClass("running"); }


		// check for SPINS
		if ((player == 1) && (playeronepos == newpos) && (playeronepos == 14) && (spin == 0)) { $(".a14").addClass("running"); myWait = 10; endWait = 10; spin = 1; 



		}

		if ((player == 1) && (playeronepos == newpos) && (playeronepos == 17) && (spin == 0)) { $(".a17").addClass("running"); myWait = 10; endWait = 10; spin = 1; 


		}
		if ((player == 1) && (playeronepos == newpos) && (playeronepos == 32) && (spin == 0)) { $(".a32").addClass("running"); myWait = 10; endWait = 10; spin = 1; 


		}

		if ((player == 1) && (playeronepos == newpos) && (playeronepos == 43) && (spin == 0)) { $(".a43").addClass("running"); myWait = 10; endWait = 10; spin = 1; 

		}

		if ((player == 1) && (playeronepos == newpos) && (playeronepos == 69) && (spin == 0)) { $(".a69").addClass("running"); myWait = 10; endWait = 10; spin = 1; 

		}

		if ((player == 1) && (playeronepos == newpos) && (playeronepos == 80) && (spin == 0)) { $(".a80").addClass("running"); myWait = 10; endWait = 10; spin = 1; 

		}
		if ((player == 2) && (playertwopos == newpos) && (playertwopos == 14) && (spin == 0)) { spin = 1; $(".a14").addClass("running"); myWait = 10; endWait = 10; throwing = 0;  

		audioElementSpin.currentTime = 0;
		audioElementSpin.play();
		$("button.rollthedice").removeClass("pressgo");
		$(".spinsid").removeClass("pressgo");
		clearInterval(boardupdater);

		sidspin();
		}

		if ((player == 2) && (playertwopos == newpos) && (playertwopos == 17) && (spin == 0)) { spin = 1; $(".a17").addClass("running"); myWait = 10; throwing = 0;  

		audioElementSpin.currentTime = 0;
		audioElementSpin.play();
		$("button.rollthedice").removeClass("pressgo");
		$(".spinsid").removeClass("pressgo");
		clearInterval(boardupdater);

		sidspin();
		}
		if ((player == 2) && (playertwopos == newpos) && (playertwopos == 32) && (spin == 0)) { spin = 1; $(".a32").addClass("running"); myWait = 10; throwing = 0;  

		audioElementSpin.currentTime = 0;
		audioElementSpin.play();
		$("button.rollthedice").removeClass("pressgo");
		$(".spinsid").removeClass("pressgo");
		clearInterval(boardupdater);

		sidspin();
		}

		if ((player == 2) && (playertwopos == newpos) && (playertwopos == 43) && (spin == 0)) { spin = 1; $(".a43").addClass("running"); myWait = 10; throwing = 0;  

		audioElementSpin.currentTime = 0;
		audioElementSpin.play();
		$("button.rollthedice").removeClass("pressgo");
		$(".spinsid").removeClass("pressgo");
		clearInterval(boardupdater);

		sidspin();
		}

		if ((player == 2) && (playertwopos == newpos) && (playertwopos == 69) && (spin == 0)) { spin = 1; $(".a69").addClass("running"); myWait = 10; throwing = 0;  

		audioElementSpin.currentTime = 0;
		audioElementSpin.play();
		$("button.rollthedice").removeClass("pressgo");
		$(".spinsid").removeClass("pressgo");
		clearInterval(boardupdater);

		sidspin();
		}

		if ((player == 2) && (playertwopos == newpos) && (playertwopos == 80) && (spin == 0)) { spin = 1; $(".a80").addClass("running"); myWait = 10; throwing = 0;  

		audioElementSpin.currentTime = 0;
		audioElementSpin.play();
		$("button.rollthedice").removeClass("pressgo");
		$(".spinsid").removeClass("pressgo");
		clearInterval(boardupdater);

		sidspin();
		}


		
		
		
		//audioElementSnake.currentTime = 0;
		//audioElementSnake.play();
		

		// check for ladders


		if ((player == 1) && (playeronepos == newpos) && (playeronepos == 8)) { $(".a8").addClass("running"); newpos = 30; myWait = 10;

		audioElementSpin.currentTime = 0;
		audioElementSpin.play();
		}

		if ((player == 2) && (playertwopos == newpos) && (playertwopos == 8)) { $(".a8").addClass("running"); newpos = 30; myWait = 10;

		audioElementSnake.currentTime = 0;
		audioElementSnake.play();
		}

		if ((player == 1) && (playeronepos == newpos) && (playeronepos == 5)) { $(".a5").addClass("running"); newpos = 56; myWait = 10;

		audioElementSpin.currentTime = 0;
		audioElementSpin.play();
		}

		if ((player == 2) && (playertwopos == newpos) && (playertwopos == 5)) { $(".a5").addClass("running"); newpos = 56; myWait = 10;

		audioElementSnake.currentTime = 0;
		audioElementSnake.play();
		}

		if ((player == 1) && (playeronepos == newpos) && (playeronepos == 20)) { $(".a20").addClass("running"); newpos = 61; myWait = 10;

		audioElementSpin.currentTime = 0;
		audioElementSpin.play();
		}

		if ((player == 2) && (playertwopos == newpos) && (playertwopos == 20)) { $(".a20").addClass("running"); newpos = 61; myWait = 10;

		audioElementSnake.currentTime = 0;
		audioElementSnake.play();
		}
		if ((player == 1) && (playeronepos == newpos) && (playeronepos == 63)) { $(".a63").addClass("running"); newpos = 85; myWait = 10;

		audioElementSpin.currentTime = 0;
		audioElementSpin.play();
		}

		if ((player == 2) && (playertwopos == newpos) && (playertwopos == 63)) { $(".a63").addClass("running"); newpos = 85; myWait = 10;

		audioElementSnake.currentTime = 0;
		audioElementSnake.play();
		}
		if ((player == 1) && (playeronepos == newpos) && (playeronepos == 72)) { $(".a72").addClass("running"); newpos = 94; myWait = 10;

		audioElementSpin.currentTime = 0;
		audioElementSpin.play();
		}

		if ((player == 2) && (playertwopos == newpos) && (playertwopos == 72)) { $(".a72").addClass("running"); newpos = 94; myWait = 10;

		audioElementSnake.currentTime = 0;
		audioElementSnake.play();
		}

		if ((player == 1) && (playeronepos == newpos) && (playeronepos == 49)) { $(".a49").addClass("running"); newpos = 67; myWait = 10;

		audioElementSpin.currentTime = 0;
		audioElementSpin.play();
		}

		if ((player == 2) && (playertwopos == newpos) && (playertwopos == 49)) { $(".a49").addClass("running"); newpos = 67; myWait = 10;

		audioElementSnake.currentTime = 0;
		audioElementSnake.play();
		}












		if ((spin == 1) && (myWait == 0) && (endWait == 0)) {clearInterval(boardupdater); mySwitch = 1; switchCounter = 0; spinreels();}


		if ((player == 1) && (playeronepos == newpos) && (myWait == 0)) {theswitch = 1; $(".a" + playeronepos).removeClass("litup").addClass("running"); }
		if ((player == 2) && (playertwopos == newpos) && (myWait == 0)) {theswitch = 1; $(".a" + playertwopos).removeClass("litup").addClass("running"); }
	
		if ((player == 2) && (playertwopos == newpos) && (endWait == 0) && (theswitch == 1)) {theswitch = 0; clearInterval(boardupdater); changeplayer();}
		if ((player == 1) && (playeronepos == newpos) && (endWait == 0) && (theswitch == 1)) {theswitch = 0; clearInterval(boardupdater); changeplayer();}

		
	}

}	



function spinreels() {

	


		audioElementReels.currentTime = 0;
		audioElementReels.play();
		
		$(".reel01").addClass("reelsup").css("display" , "block");
		reeltimecounter = 0;
		var reeltimeone = (Math.floor(Math.random()*10) + 20);
		var reeltimetwo = ((Math.floor(Math.random()*10) + reeltimeone) + 20);
		var reeltimethree = ((Math.floor(Math.random()*10) + reeltimetwo) + 20);
		var waitafterspin = reeltimethree;
		$(".rollthedice").removeClass("pressgo");
		$(".reel0").addClass("levelup");
		$(".reel1").addClass("levelup");
		$(".reel2").addClass("levelup");
		$(".reel01").removeClass("slideup");
	 	
	 	var rasterspin = setInterval(spincode, 50);
		var buttonclicked = 1;
		function spincode() {

		
		
		if (mySwitch == 1) switchCounter++;
		
		//console.log(switchCounter);
		//console.log(waitafterspin);

		if (switchCounter > waitafterspin + linetotal) { 
		
		$(".pone").text(playeronepos);
		$(".ptwo").text(playertwopos);

		if ((player == 1) && (newpos > playeronepos)) {playeronepos++;

			$(".a" + playeronepos).addClass("litup");
			
		}

		if ((player == 1) && (newpos == playeronepos)) {$(".a" + playeronepos).removeClass("litup").addClass("running");}

		if ((player == 2) && (newpos > playertwopos)) {playertwopos++;

			$(".a" + playertwopos).addClass("litup");}

		}

		if ((player == 2) && (newpos == playertwopos)) {$(".a" + playertwopos).removeClass("litup").addClass("running");}

		if ((switchCounter > waitafterspin) + (linetotal * 2))  {

		mySwitch = 0; switchCounter = 0; spin = 0;
		linetotal = 0;
		clearInterval(rasterspin);
		itsDone = 0;
		//console.log("341 turnraster off");
		updateboard();
		}

		reeltimecounter++;




// check for ladders

		if (reeltimecounter == reeltimeone) {
		//console.log("reel0");
		myreel = 0;
		
		var reelpos = parseInt($(".reel" + myreel).css('transform').split(',')[5]);
		var reelstarting = reelpos;
		reelpos *= -1;
		//console.log(reelpos);
		reelpostemp = (reelpos / 48.57);
		//console.log(reelpostemp);
		var loc = parseInt(reelpostemp);
		reelnumber[myreel] = myArray[loc];

		var reelpostempa = (reelpostemp - parseInt(reelpostemp));
		//console.log(reelpostempa);
		reelpostempa *= 48.57;
		reelpostempa = parseInt(reelpostempa);
		//console.log(reelpostempa);
		var pushingtoreel = reelpos - reelpostempa;
		//console.log(pushingtoreel);


		$(".reel" + myreel).removeClass("levelup");
		//$(".reel1").delay(1000).removeClass("levelup");
		//$(".reel2").delay(2000).removeClass("levelup");

    var current_pull = parseInt($(".reel" + myreel).css('transform').split(',')[5]);

	var current_diff = (current_pull / 48.57);
	var current_removeInt = current_diff - parseInt(current_diff);
	//var current_pull = (current_removeInt * 48.57);
	pushingtoreel *= -1;
	$(".reel" + myreel).css('transform', 'translateY(' + pushingtoreel + 'px)');
	//$('.reel1').delay(1000).css('transform', 'translateY(' + pushingtoreel + 'px)');
	//$('.reel2').delay(2000).css('transform', 'translateY(' + pushingtoreel + 'px)');
		audioElementReel.currentTime = 0;
		audioElementReel.play();
}


	if (reeltimecounter == reeltimetwo) {
		
		myreel = 1;
		
		var reelpos = parseInt($(".reel" + myreel).css('transform').split(',')[5]);
		var reelstarting = reelpos;
		reelpos *= -1;
		//console.log(reelpos);
		reelpostemp = (reelpos / 48.57);
		//console.log(reelpostemp);
		var loc = parseInt(reelpostemp);
		reelnumber[myreel] = myArray[loc];

		var reelpostempa = (reelpostemp - parseInt(reelpostemp));
		//console.log(reelpostempa);
		reelpostempa *= 48.57;
		reelpostempa = parseInt(reelpostempa);
		//console.log(reelpostempa);
		var pushingtoreel = reelpos - reelpostempa;
		//console.log(pushingtoreel);


		$(".reel" + myreel).removeClass("levelup");
		//$(".reel1").delay(1000).removeClass("levelup");
		//$(".reel2").delay(2000).removeClass("levelup");

    var current_pull = parseInt($(".reel" + myreel).css('transform').split(',')[5]);

	var current_diff = (current_pull / 48.57);
	var current_removeInt = current_diff - parseInt(current_diff);
	//var current_pull = (current_removeInt * 48.57);
	pushingtoreel *= -1;
	$(".reel" + myreel).css('transform', 'translateY(' + pushingtoreel + 'px)');
	//$('.reel1').delay(1000).css('transform', 'translateY(' + pushingtoreel + 'px)');
	//$('.reel2').delay(2000).css('transform', 'translateY(' + pushingtoreel + 'px)');
		audioElementReel.currentTime = 0;
		audioElementReel.play();
}

	if (reeltimecounter == reeltimethree) {
	
		myreel = 2;
		
		var reelpos = parseInt($(".reel" + myreel).css('transform').split(',')[5]);
		var reelstarting = reelpos;
		reelpos *= -1;
		//console.log(reelpos);
		reelpostemp = (reelpos / 48.57);
		//console.log(reelpostemp);
		var loc = parseInt(reelpostemp);
		reelnumber[myreel] = myArray[loc];

		var reelpostempa = (reelpostemp - parseInt(reelpostemp));
		//console.log(reelpostempa);
		reelpostempa *= 48.57;
		reelpostempa = parseInt(reelpostempa);
		//console.log(reelpostempa);
		var pushingtoreel = reelpos - reelpostempa;
		//console.log(pushingtoreel);


		$(".reel" + myreel).removeClass("levelup");
		//$(".reel1").delay(1000).removeClass("levelup");
		//$(".reel2").delay(2000).removeClass("levelup");

    var current_pull = parseInt($(".reel" + myreel).css('transform').split(',')[5]);

	var current_diff = (current_pull / 48.57);
	var current_removeInt = current_diff - parseInt(current_diff);
	//var current_pull = (current_removeInt * 48.57);
	pushingtoreel *= -1;
	$(".reel" + myreel).css('transform', 'translateY(' + pushingtoreel + 'px)');
	//$('.reel1').delay(1000).css('transform', 'translateY(' + pushingtoreel + 'px)');
	//$('.reel2').delay(2000).css('transform', 'translateY(' + pushingtoreel + 'px)');

	linetotal = (reelnumber[0] + reelnumber[1] + reelnumber[2]);
		audioElementReel.currentTime = 0;
		audioElementReel.play();
		audioElementReels.pause();
	waitafterspin = reeltimecounter;
	//$("button").removeClass("glow");
		myreel = 0;
		spin = 0;
		if (player == 1) {newpos = playeronepos + linetotal; endWait = 14;}
		if (player == 2) {newpos = playertwopos + linetotal; endWait = 14;}
		
		if ((player == 1) && (newpos > 100)) {backnote = newpos - 100; newpos = 100 - backnote; audioElementSnake.currentTime = 0;
		audioElementSnake.play();
		}
		if ((player == 2) && (newpos > 100)) {backnote = newpos - 100; newpos = 100 - backnote; audioElementSnake.currentTime = 0;
		audioElementSnake.play();
		}

		//if (newpos == 100) animpos = 100; clearoneoff = 1;

		$(".reeltotalafter").text(linetotal);
		
		
		if (itsDone == 0) {
		$(".reeltotal").css("display" , "block").css("animation-play-state","running");
		var ela = $(".reeltotal"), newone = ela.clone(true);
		ela.before(newone);        
 		$("." + ela.attr("class") + ":last").remove();



		$(".reeltotalafter").css("display" , "block").css("animation-play-state","running");
		var elb = $(".reeltotalafter"), newtwo = elb.clone(true);
		elb.before(newtwo);        
 		$("." + elb.attr("class") + ":last").remove();


		
		$(".reel01").addClass("slideup");
		var el = $("slideup"), newthree = el.clone(true);
		el.before(newthree);        
 		$("." + el.attr("class") + ":last").remove();
		
		//if (player == 1) $(".a" + playeronepos).removeClass("static").removeClass("litup").addClass("running");
		//if (player == 2) $(".a" + playertwopos).removeClass("static").removeClass("litup").addClass("running");
		
			
		//console.log(switchCounter);
		itsDone = 1;
		myWait = linetotal + 12;
	}}
}}

function playertwo() {
	rollinprocess = 0;
	player = 2;
	$(".rollthedice").removeClass("pressgo");
	
	sidtimer = 0;

	tie = setInterval(twocode, 50);
	
	function twocode() {

		sidtimer++;

		if (sidtimer == 5) {$(".sid").css("display","block");
		$(".rollthedicesid").addClass("pressgo");}
		$(".sid").addClass("sidrolldice");
		
		if (sidtimer == 30) 	{$(".rollthedicesid").removeClass("pressgo"); sidthrowdice();}
	
		if (sidtimer == 35) 	$(".sidblink").css("display","block");

		if (sidtimer == 38) 	$(".sidblink").css("display","none");

		if (sidtimer == 40) 	$(".sidblink").css("display","block");

		if (sidtimer == 43) 	$(".sidblink").css("display","none");

		if (sidtimer == 50) 	$(".sidblink").css("display","block");

		if (sidtimer == 52) 	$(".sidblink").css("display","none");

		if (sidtimer == 60) 	$(".sideyes").css("display","block");

		if (sidtimer == 64) 	$(".sideyes").css("display","none");
	
		if (sidtimer == 80) 	{$(".sid").css("display", "none"); clearInterval(tie); sidtimer = 0;}
		
}

}

});
