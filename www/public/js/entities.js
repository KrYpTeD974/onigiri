function SpriteFactory()
{
	var tatami_spritesheet;
	var onigiri_spritesheet;

	this.init = function()
	{
		this.tatami_spritesheet = new createjs.SpriteSheet(
		{
	        "images": [loader.getResult("tatami")],
	        "frames": {width:90, height:90},
	        "animations": {
	        			   "blue_left":    [0, 0],
	        			   "blue_right":   [1, 1],
	        			   "green_left":   [2, 2],
	        			   "green_right":  [3, 3],
	        			   "red_left":     [4, 4],
	        			   "red_right":    [5, 5],
	        			   "purple_left":  [6, 6],
	        			   "purple_right": [7, 7]
	        			   }
        });

        this.onigiri_spritesheet = new createjs.SpriteSheet(
        {
        	"images": [loader.getResult("onigiri")],
        	"frames": {width:90, height:90,
        		       regX:45, regY:45 //centre de gravité
        			  },
        	"animations": {
        		"onigiri":[0, 0]
        	}
        });

        this.arrow_spritesheet = new createjs.SpriteSheet(
		{
            "images": [loader.getResult("arrows")],
            "frames": {width:90, height:90,
            		   regX:45, regY:45
            		  },
            "animations": {
            			   "arrow_right":[0, 0],
            			   "arrow_up":   [1, 1],
            			   "arrow_left": [2, 2],
            			   "arrow_down": [3, 3]
            			   }
        });

        this.dice_spritesheet = new createjs.SpriteSheet(
		{
            "images": [loader.getResult("dice")],
            "frames": {width:90, height:90,
            		   regX:45, regY:45,
            		   count:4
            		  },
            "animations": {
            			   "dice_ichi":{frames: [0, 1, 2, 3, 2, 1],
            			   			    speed:0.5
            			   				},
            			   }
        });
	}

	this.create_onigiri = function(x, y, orientation)
	{
		var onigiri = new Onigiri(this.onigiri_spritesheet, this.arrow_spritesheet, x, y, orientation);
		return onigiri;
	}

	this.create_tatami = function(type, x, y, id, orientation)
	{
		var tatami = new Tatami(this.tatami_spritesheet, type, x, y, id, orientation);
		return tatami
	}

	this.create_dice = function(x, y)
	{
		return new Dice(this.dice_spritesheet, x, y);
	}
}


function Dice(spritesheet, x, y)
{
	this.initialize();
	this.dice = new createjs.Sprite(spritesheet, "dice_ichi");
	this.addChild(this.dice);
	this.x = x;
	this.y = y;	
	this.dice.framerate = 5;
	this.locked = false

	this.on_click = function(event)
	{
		if(!event.currentTarget.locked)
		{
			var dice = event.currentTarget
			var value = dice.get_random_value();
			console.log("random" + value);
			dice.dice.stop();
			dice.dice.currentAnimationFrame = value -1;
			event.stopPropagation();
			game.phase_3(value);
			this.locked = true;
		}
		else{
			console.log("itslocked")
		}

	}

	this.get_random_value = function()
	{
		var num = Math.floor((Math.random()*6)+1);
		switch(num)
		{
			case 5:
				return 2;
			case 6:
				return 3;
			default:
				return num;
		}
	}

	this.play = function()
	{
		console.log("playing...");
		this.dice.play();
	}

	this.addEventListener("click", this.on_click);

}
Dice.prototype = new createjs.Container();

function Arrow(spritesheet, x, y, orientation, onigiri)
{
	this.initialize();
	this.x = x;
	this.y = y;
	this.scaleX = 1.60;
	this.scaleY = 1.60;
	this.onigiri = onigiri;
	orientation_values = ["up", "left", "down", "right"];

	if (!$.inArray(orientation, orientation_values)== -1)
	{
		throw("orientation can only be 'up','left', 'down' or 'right'. Not " + orientation);
	}
	this.orientation = orientation;

	var arrow = new createjs.Sprite(spritesheet, "arrow_" + orientation);
	this.addChild(arrow)

	this.on_click = function(event)
	{
		arrow = event.currentTarget

		arrow.onigiri.orientation = arrow.orientation;
		arrow.onigiri.clear_arrows();
		event.stopPropagation();
		game.phase_2();
	}
	this.addEventListener("click", this.on_click);

	this.on_mouseover = function(event)
	{
		 var matrix = new createjs.ColorMatrix().adjustBrightness(30);
		 event.currentTarget.filters = [
		     new createjs.ColorMatrixFilter(matrix)
 			];

 		event.currentTarget.cache(-45,-45,90,90);
	}
	this.on_mouseout = function(event)
	{
		event.currentTarget.filters = null;
		event.currentTarget.updateCache();
	}
	this.addEventListener("click", this.on_click);
	this.addEventListener("mouseover", this.on_mouseover);
	this.addEventListener("mouseout", this.on_mouseout);
}
Arrow.prototype = new createjs.Container();
