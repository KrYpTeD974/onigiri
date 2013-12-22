function Board()
{
	this.initialize();
	var gen_id = 1;
	var sprite_factory;
	this.grid = [[0,0,0,0,0,0,0,0,0],
				 [0,0,0,0,0,0,0,0,0],
				 [0,0,0,0,0,0,0,0,0],
				 [0,0,0,0,0,0,0,0,0],
				 [0,0,0,0,0,0,0,0,0],
				 [0,0,0,0,0,0,0,0,0],
				 [0,0,0,0,0,0,0,0,0],
				 [0,0,0,0,0,0,0,0,0],
				 [0,0,0,0,0,0,0,0,0],
				 ];
 
	this.load = function()
	{
		this.addChild(new createjs.Bitmap(loader.getResult("board")));
		this.x = 0;
		this.y = 0;

		this.sprite_factory = new SpriteFactory();
		this.sprite_factory.init();

		this.onigiri = this.sprite_factory.create_onigiri(4, 4, "all");
		this.onigiri.load(this);
	}

	this.display_dice = function()
	{
		var dice = this.sprite_factory.create_dice(1100, 405);
		dice.name = "dice";
		this.addChild(dice);
		dice.play();

	}

	this.clear_dice = function()
	{
		var dice = this.getChildByName("dice");
		this.removeChild(dice);
		dice = undefined;

	}

	this.check_and_move_edge = function(x, y, nb_cases)
	{
		console.log("check_and_move_edge");

		if (y==0)
		{
			if (this.onigiri.orientation == "up")
			{
				if(x % 2 == 0)
				{
					this.onigiri.orientation = "left";
					this.onigiri.move_onigiri(x-1, y, this.move_onigiri_case, [nb_cases], this);
				}else
				{
					this.onigiri.orientation = "right";
					this.onigiri.move_onigiri(x+1, y, this.move_onigiri_case, [nb_cases], this);
				}
				return nb_cases;

			}else if(this.onigiri.orientation == "left" || this.onigiri.orientation == "right")
			{
				this.onigiri.orientation = "down";
				this.onigiri.move_onigiri(x, y+1, this.move_onigiri_case, [nb_cases], this);
				return nb_cases;
			}
		}
		else if(y==8)
		{
			if (this.onigiri.orientation == "down")
			{
				if(x % 2 == 1)
				{
					this.onigiri.orientation = "left";
					this.onigiri.move_onigiri(x-1, y, this.move_onigiri_case, [nb_cases], this);
				}else
				{
					this.onigiri.orientation = "right";
					this.onigiri.move_onigiri(x+1, y, this.move_onigiri_case, [nb_cases], this);
				}
				return nb_cases;

			}else if(this.onigiri.orientation == "left" || this.onigiri.orientation == "right")
			{
				this.onigiri.orientation = "up";
				this.onigiri.move_onigiri(x, y-1, this.move_onigiri_case, [nb_cases], this);
				return nb_cases;
			}

		}else if (x == 0)
		{
			if (this.onigiri.orientation == "left")
			{
				if(y % 2 == 1)
				{
					this.onigiri.orientation = "down";
					this.onigiri.move_onigiri(x, y+1, this.move_onigiri_case, [nb_cases], this);
				}else
				{
					this.onigiri.orientation = "up";
					this.onigiri.move_onigiri(x, y-1, this.move_onigiri_case, [nb_cases], this);
				}
				return nb_cases;

			}else if(this.onigiri.orientation == "up" || this.onigiri.orientation == "down")
			{
				this.onigiri.orientation = "right";
				this.onigiri.move_onigiri(x+1, y, this.move_onigiri_case, [nb_cases], this);
				return nb_cases;
			}
		}else if (x == 8)
		{
			if (this.onigiri.orientation == "right")
			{
				if(y % 2 == 0)
				{
					this.onigiri.orientation = "down";
					this.onigiri.move_onigiri(x, y+1, this.move_onigiri_case, [nb_cases], this);
				}else
				{
					this.onigiri.orientation = "up";
					this.onigiri.move_onigiri(x, y-1, this.move_onigiri_case, [nb_cases], this);
				}
				return nb_cases;

			}else if(this.onigiri.orientation == "up" || this.onigiri.orientation == "down")
			{
				this.onigiri.orientation = "left";
				this.onigiri.move_onigiri(x-1, y, this.move_onigiri_case, [nb_cases], this);
				return nb_cases;
			}

		}
	}
	
	this.move_onigiri_case = function(nb_cases)
	{
		var current_x = this.onigiri.get_position("x");
		var current_y = this.onigiri.get_position("y");
		if(current_x == 0 || current_y == 0 ||
		   current_x == 8 || current_y == 8)
		{
			nb_cases = this.check_and_move_edge(current_x, current_y, nb_cases)
		}else
		{
			if(nb_cases > 0)
			{
				console.log(nb_cases)

				var orientation = this.onigiri.orientation;

				switch(orientation)
				{
					case "up":
						this.onigiri.move_onigiri(current_x, current_y-1, this.move_onigiri_case, [--nb_cases], this);
						break;
					case "down":
						this.onigiri.move_onigiri(current_x, current_y+1, this.move_onigiri_case, [--nb_cases], this);
						break;
					case "left":
						this.onigiri.move_onigiri(current_x-1, current_y, this.move_onigiri_case, [--nb_cases], this);
						break;
					case "right":
						this.onigiri.move_onigiri(current_x+1, current_y, this.move_onigiri_case, [--nb_cases], this);
						break;
				}
			}
			else
			{
				game.phase_4();
			}
		}
	}

	this.insert_tatami = function(type, x, y, orientation, dont_add_in_grid)
	{
		console.log("inserting tatami on x: "+ x + " y: "+ y);
		switch(orientation)
		{
			case "horizontal":
				var true_x = x * CELL_WIDTH + L_BORDER_WIDTH;
				var true_y = y * CELL_HEIGHT + L_BORDER_HEIGHT - CELL_HEIGHT / 2;
				var tatami = this.sprite_factory.create_tatami(type, true_x, true_y, gen_id++, orientation);
				if (!dont_add_in_grid == true)
				{
					this.grid[x][y] = {color: tatami.color,
						          	   id: tatami.id
								  };
					this.grid[x+1][y] = {color: tatami.color,
						          id: tatami.id
								  };
				}
				break;
			case "vertical":
				var true_x = x * CELL_WIDTH + L_BORDER_WIDTH - CELL_WIDTH/2;
				var true_y = y * CELL_HEIGHT + L_BORDER_HEIGHT;
				var tatami = this.sprite_factory.create_tatami(type, true_x, true_y, gen_id++, orientation);

				if (!dont_add_in_grid == true)
				{
					this.grid[x][y] = {color: tatami.color,
						          id: tatami.id
								  };
					this.grid[x][y+1] = {color: tatami.color,
						          id: tatami.id
								  };
				}
				break;
			default:
				throw("Bad orientation: " + orientation +". Only 'vertical' or 'horizontal'");
		}
		
		stage.addChild(tatami);
		return tatami
	}

	this.on_click = function(event)
	{
		board = event.currentTarget;

		x = event.stageX;
		y = event.stageY;
		tatami_x = Math.ceil((x-L_BORDER_WIDTH)/CELL_WIDTH);
		tatami_y = Math.ceil((y-L_BORDER_HEIGHT)/CELL_HEIGHT);

		board.onigiri.move_onigiri(tatami_x, tatami_y);
	}
	// this.addEventListener("click", this.on_click);

	this.display_tatami = function(color)
	{
		this.insert_tatami(color, 9.05, 5, "horizontal", true);
		this.insert_tatami(color, 9.6, 2, "vertical", true);
	}

	this.check_tatami = function(player)
	{
		x = this.onigiri.get_position("x");
		y = this.onigiri.get_position("y");

		if (this.grid[x][y] != 0 && this.grid[x][y].color != player.color)
		{	
			under_color = this.grid[x][y].color

		}else
		{
			return 0;
		}
	}
}
Board.prototype = new createjs.Container();

