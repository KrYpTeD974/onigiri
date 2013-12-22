function Tatami(spritesheet, color, x, y, id, orientation)
{
	orientation = defaultFor(orientation, "horizontal");
	
	this.initialize()
	this.color = color;
	this.x = x;
	this.y = y;
	this.id = id;
	this.orientation = orientation;
	
	this.initial_x = x;
	this.initial_y = y;
	var t1 = new createjs.Sprite(spritesheet, color + "_left");
	var t2 = new createjs.Sprite(spritesheet, color + "_right");
	t2.x = 90;

	this.addChild(t1);
	this.addChild(t2);
	this.regX = 90; 
	this.regY = 45; 
	var rotation;

	switch(orientation){
		case "vertical":
			rotation = 90;
			break;
		case "horizontal":
			rotation = 0;
			break;
		default:
			throw("Bad orientation: " + orientation +". Only 'vertical' or 'horizontal'");
	}
	this.rotation = rotation;

	this.on_pressmove = function(event)
	{
		event.currentTarget.x = event.stageX;
		event.currentTarget.y = event.stageY;
	}
	this.addEventListener("pressmove", this.on_pressmove);
	
	this.on_pressup = function(event)
	{
		tatami = event.currentTarget
		x = tatami.x;
		y = tatami.y;
		board = tatami.getStage().getChildByName("board");

		switch(event.currentTarget.orientation)
		{
			case "horizontal":
				if(x > L_BORDER_WIDTH + CELL_WIDTH && 
				   x < L_BORDER_WIDTH + CELL_WIDTH * 6 + CELL_WIDTH/2 &&
				   y > CELL_HEIGHT &&
				   y < CELL_HEIGHT * 8)
				{
					event.currentTarget.x = CELL_WIDTH * Math.round((x-L_BORDER_WIDTH)/CELL_WIDTH) + L_BORDER_WIDTH;
					event.currentTarget.y = CELL_HEIGHT* Math.ceil((y-L_BORDER_HEIGHT)/CELL_HEIGHT) + L_BORDER_HEIGHT - CELL_HEIGHT/2;
					board.insert_tatami(tatami.color, Math.round((x-L_BORDER_WIDTH)/CELL_WIDTH), Math.ceil((y-L_BORDER_HEIGHT)/CELL_HEIGHT), "horizontal");
					
				}else
				{
					Tween.get(tatami).to({x:tatami.initial_x}, 300);
					Tween.get(tatami).to({y:tatami.initial_y}, 300);

				}
				break;
				
			case "vertical":
				if(x > L_BORDER_WIDTH&& 
				   x < L_BORDER_WIDTH + CELL_WIDTH * 7 &&
				   y > CELL_HEIGHT + CELL_HEIGHT/2 &&
				   y < CELL_HEIGHT * 7 + CELL_HEIGHT/2)
				{
					event.currentTarget.x = CELL_WIDTH * Math.ceil((x-L_BORDER_WIDTH)/CELL_WIDTH) + L_BORDER_WIDTH - CELL_WIDTH/2;
					event.currentTarget.y = CELL_HEIGHT* Math.round((y-L_BORDER_HEIGHT)/CELL_HEIGHT) + L_BORDER_HEIGHT;
					
					board.insert_tatami(tatami.color, x, y-CELL_HEIGHT/2, "vertical");
					board.insert_tatami(tatami.color, Math.round((x-L_BORDER_WIDTH)/CELL_WIDTH), Math.ceil((y-L_BORDER_HEIGHT)/CELL_HEIGHT), "horizontal");

				}else
				{
					Tween.get(tatami).to({x:tatami.initial_x}, 300);
					Tween.get(tatami).to({y:tatami.initial_y}, 300);
				}
				break;
			default:
				throw("Bad orientation: " + orientation +". Only 'vertical' or 'horizontal'");
		}
	}
	this.on("pressup", this.on_pressup);
}
Tatami.prototype = new createjs.Container();