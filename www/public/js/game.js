//Constantes
var MANIFEST_PATH = "public/ressources/manifest.json";

var stage;
var loader;
var game;

var CELL_WIDTH = 90;
var CELL_HEIGHT = 90;
var L_BORDER_WIDTH = 280;
var L_BORDER_HEIGHT = 90;

Tween = createjs.Tween;
Ease = createjs.Ease;

function init_onigiri()
{
	stage = new createjs.Stage("onigiriBoard");
	stage.enableMouseOver();

	loadRessources();
}	

function loadRessources()
{

	//On recupere le fichier manifest.json
	$.getJSON(MANIFEST_PATH, function(manifest_json)
	{
		loader = new createjs.LoadQueue(false);
	 	loader.addEventListener("fileload", handleFileLoad);
	 	loader.addEventListener("complete", handleComplete);
	 	loader.loadManifest(manifest_json);
	 });

}

function handleFileLoad(){}
function handleComplete(){

	initGame();
}

function initGame(){
	createjs.Ticker.addEventListener("tick", tick);
	game = new Game();
	game.init();
}

function tick(){
	// input();
	//ai();
	update();
	// sound();
}

function update(){
	stage.update();
}



function Game()
{
	this.board;
	this.message;
	this.player;
	this.socket;

	this.init = function(){
		this.board = new Board();
		this.board.load();
		this.board.name = "board";
		stage.addChild(this.board);

		this.message = new createjs.Text("", "20px Arial", "#ffffff");
		this.message.x = 10;
		this.message.y = 10;
		this.message.lineWidth = 150;
		stage.addChild(this.message);
		
		this.socket = io.connect('http://debian-dev:8080');
		this.socket.emit('create', 'room1');
		
		var name = prompt("Entrez votre pseudo");

		this.player = new Player(name, "blue", 1);

		this.phase_1();

	}

	this.phase_1 = function(){
		//direction onigiri
		console.log("Phase 1");
		this.message.text = "Phase 1: Indiquez la direction à onigiri";
		
		this.board.onigiri.display_arrows();
	}

	this.phase_2 = function(){
		//lancé de dés
		console.log("Phase 2");
		this.message.text = "Phase 2: Cliquez sur le dé";

		this.board.display_dice()
		
	}

	this.phase_3 = function(nb_cases){
		// déplacement onigiri
		console.log("phase_3 : " + nb_cases + " cases")
		this.message.text = "Phase 3: Déplacement d'Onigiri";

		this.board.move_onigiri_case(nb_cases);
	}

	this.phase_4 = function(){
		//calcul tatami
		console.log("phase_4")
		this.message.text = "Phase 4: Calcul des coûts";
		this.board.clear_dice();
		this.board.check_tatami(this.player);
		this.phase_5();
	}
	this.phase_5 = function(){
		// placement tatami
		console.log("phase_5")
		this.message.text = "Phase 5: Placez votre tatami autour d'Onigiri";

		this.board.clear_dice();
		this.board.display_tatami(this.player.color)
	}
}

function Player(name, color, number)
{
	this.name = name;
	this.color = color;
	this.number = number;


}


function defaultFor(arg, val) { return typeof arg !== 'undefined' ? arg : val; }