var chargeSeqVar = null;

// constructor for player object
function Player(canvas_width, canvasHeight, canvas, bulletMgr){
  // player instance variables
  this._CANVAS_WIDTH = canvas_width;
  this._CANVAS_HEIGHT = canvasHeight;
  this.bulletMgr = bulletMgr;
  this.color = "#170FBA";
  this.chargeColor = "#6CD1F0";
  this.width = this._CANVAS_WIDTH / 3;
  this.height = 50;
  // this.x = (CANVAS_WIDTH / 2) - (this.width / 2);
  this._currentPos = 1;    // player starts in the middle
  this._y = this._CANVAS_HEIGHT - this.height;
  var _xPositions = [0, this._CANVAS_WIDTH / 3, (this._CANVAS_WIDTH / 3) * 2];   // lut for player x positions
  this._x = _xPositions[this._currentPos];
  this.totalChargeSteps = 20;
  var chargeStepHeight = this.height / this.totalChargeSteps;
  this._chargeStep = 0;

  var charge;

  // console.log(bullets[0]);
  // draw player
  this.draw = function(){
    canvas.fillStyle = this.color;
    canvas.fillRect(this._x, this._y, this.width, this.height);
    canvas.fillStyle = this.chargeColor;
    canvas.fillRect(this._x, this._CANVAS_HEIGHT - (chargeStepHeight * this._chargeStep),
     this.width, this._CANVAS_HEIGHT);
  };

  // moves player position to left
  this.moveLeft = function(){
    if(this._currentPos > 0){
      this._currentPos--;
      this._x = _xPositions[this._currentPos];
    }
  };

  // moves player position to right
  this.moveRight = function(){
    if(this._currentPos < 2){
      this._currentPos++;
      this._x = _xPositions[this._currentPos];
    }
  };

  // moves player depending on xPos
  this.move = function(xPos){
    var step = this.width;
    var pos = Math.floor(xPos / step);
    this._x = _xPositions[pos];
  };

  // get coords of player center point
  this.centerPoint = function(){
    return {x:this._x + (this.width / 2), y: this._CANVAS_HEIGHT - this.height};
  };

  // get player x position
  this.getX = function(){
    return this._x;
  };

  // get player y position
  this.getY = function(){
    return this._y;
  };

  // called to increase the players charge step
  this.incrementChargeStep = function(){
    if(this._chargeStep < this.totalChargeSteps){
      this._chargeStep++;
    }
  };

  // player shoots a missile
  this.shoot = function(){
    this.bulletMgr.fireBullet(this.centerPoint());
  };

  // resets the players charge step
  this.clearCharge = function(){
    this._chargeStep = 0;
  };

  // returns true if the player has reached their charge threashold
  this.chargeFinished = function(){
    return this._chargeStep >= this.totalChargeSteps;
  }

  // check for collisions with enemy
  this.collision = function(e){
    return e.y + e.height>= this._y;
  };
}

function Enemy(canvasWidth, canvasHeight, canvas){
  // instance variables
  this._canvas = canvas;
  this._CANVAS_WIDTH = canvasWidth;
  this._CANVAS_HEIGHT = canvasHeight;
  this.active = true;
  this.width = 40;
  this.height = 40;
  this.yVelocity = 3;   // moving downward
  var _start = Math.floor(Math.random() * 3);
  var _offset = (this._CANVAS_WIDTH / 3) / 2 - (this.width / 2);
  this._xPositions = [0 + _offset, (this._CANVAS_WIDTH / 3) + _offset, ((this._CANVAS_WIDTH / 3) * 2) + _offset];   // lut for player x positions
  this.x = this._xPositions[_start];
  this.y = 40;
  this._colors = ['#87DEDE', '#B387DE', "#B3DE87"]
  this.color = this._colors[Math.floor(Math.random()*3)];
  return this;
}

Enemy.prototype = {
  inBounds: function(){
    return this.x >= 0 && this.x <= this._CANVAS_WIDTH
       && this.y >= 0 && this.y <= this._CANVAS_HEIGHT;
  },
  draw: function(){
    this._canvas.fillStyle = this.color;
    this._canvas.fillRect(this.x, this.y, this.width, this.height);
  },
  update: function(){
    this.y += this.yVelocity;
    this.active = this.active && this.inBounds();
  },
  collision: function(b){
    return b.x >= this.x && b.x <= (this.x + this.height) &&
     b.y >= this.y && b.y <= (this.y + this.height);
  },
  explode: function(){
    this.active = false;
  }
};

// constructor for Score object
function Score(canvasWidth, canvasHeight, canvas){
  // instance variables
  this._canvas = canvas;
  this._CANVAS_WIDTH = canvasWidth;
  this._CANVAS_HEIGHT = canvasHeight;
  this._score = 0;
  this.color = "#00A";

  // increments score by 1
  this.increment = function(){
    this._score++;
  }

  // resets the score for a new game
  this.reset = function(){
    this._score = 0;
  }

  // draws score to canvas
  this.draw = function(){
    this._canvas.fillStyle = this.color;
    this._canvas.font = "normal 30px Arial";
    this._canvas.textAlign = "center";
    this._canvas.fillText(this._score, this._CANVAS_WIDTH / 2, 30);
  }
}
