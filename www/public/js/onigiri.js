function Onigiri(spritesheet, arrow_ss, x, y, orientation)
{
	this.initialize();
	var arrow_ss = arrow_ss;
	orientation_values = ["up", "left", "down", "right", "all"];
	if ($.inArray(orientation, orientation_values) == -1)
	{
		throw("orientation can only be 'up','left', 'down' or 'right'. Not " + orientation);
	}
	this.orientation = orientation;

	this.addChild(new createjs.Sprite(spritesheet, "arrow_right"));

	var create_arrow = function(x, y, orientation, onigiri)
	{
		var arrow = new Arrow(arrow_ss, x, y, orientation, onigiri);
		return arrow;
	}

	this.display_arrows = function(){

		switch(this.orientation){
			case "up":
				this.addChild(create_arrow(0, -CELL_HEIGHT, "up", this));
				this.addChild(create_arrow(-CELL_WIDTH, 0, "left", this));
				this.addChild(create_arrow(CELL_WIDTH, 0, "right", this));
				break;
			case "down":
				this.addChild(create_arrow(0, CELL_HEIGHT, "down", this));
				this.addChild(create_arrow(-CELL_WIDTH, 0, "left", this));
				this.addChild(create_arrow(CELL_WIDTH, 0, "right", this));
				break;
			case "left":
				this.addChild(create_arrow(0, -CELL_HEIGHT, "up", this));
				this.addChild(create_arrow(0, CELL_HEIGHT, "down", this));
				this.addChild(create_arrow(-CELL_WIDTH, 0, "left", this));
				break;
			case "right":
				this.addChild(create_arrow(0, -CELL_HEIGHT, "up", this));
				this.addChild(create_arrow(0, +CELL_HEIGHT, "down", this));
				this.addChild(create_arrow(+CELL_WIDTH, 0, "right", this));
				break;
			case "all":
				this.addChild(create_arrow(0, -CELL_HEIGHT, "up", this));
				this.addChild(create_arrow(0, +CELL_HEIGHT, "down", this));
				this.addChild(create_arrow(+CELL_WIDTH, 0, "right", this));
				this.addChild(create_arrow(-CELL_WIDTH, 0, "left", this));
				break;
			default :
				throw("Incorrect orientation");
		}
	}

	this.clear_arrows = function(){
		var a = this.getChildAt(0);
		this.removeAllChildren();
		this.addChild(a);
	}

	this.load = function(parent){
		parent.addChild(this);
	}

	this.set_position = function(x, y){
		this.x = x * CELL_WIDTH + L_BORDER_WIDTH - CELL_WIDTH/2;
		this.y = y * CELL_HEIGHT + L_BORDER_HEIGHT - CELL_HEIGHT/2;
	}

	this.get_position = function(coord){
		switch(coord){
			case "x":
				return Math.round((this.x - L_BORDER_WIDTH) / CELL_WIDTH);
				break;
			case "y":
				return Math.round((this.y - L_BORDER_HEIGHT) / CELL_HEIGHT);
				break;
			default:
				pos_x = Math.round((this.x - L_BORDER_WIDTH) / CELL_WIDTH);
				pos_y = Math.round((this.y - L_BORDER_HEIGHT) / CELL_HEIGHT);
				return {x: pos_x,
					 	y: pos_y}
		}
	}
	
	this.move_onigiri = function(x, y, callback, param, scope){
		x_to_reach = x * CELL_WIDTH + L_BORDER_WIDTH - CELL_WIDTH/2;
		y_to_reach = y * CELL_HEIGHT + L_BORDER_HEIGHT - CELL_HEIGHT/2;


		Tween.get(this).to({y:y_to_reach}, 500)
		Tween.get(this).to({x:x_to_reach}, 500)

		Tween.get(this).to({scaleX:1.1, scaleY:1.1}, 250, Ease.circOut)
				       .call(
				      	function()
				      	{
				      		var tween = Tween.get(this)
				      	         			 .to({scaleX:1, scaleY:1}, 250, Ease.circIn)
				      	    if (callback != undefined)
				      	    {
				      	    	tween.wait(300).call(callback, param, scope);
				      	    }
			 			})
	}
	this.set_position(x, y);

}
Onigiri.prototype = new createjs.Container();