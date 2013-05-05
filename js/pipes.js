window.mobilecheck = function() {
var check = false;
(function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
return check; }

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
// SETUP gameDataManager 
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
var gameOptionsManager = {
	fillSpeed: 1500,
	outOfPlayAreaKills: false,
	additiveMode: false,
	godMode: false,
	selectedPipeValue: [1,1,1,0],//null
	topLeftPipe:null
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
// SETUP Node OBJECTS
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
var Node = function(connections, connectionStatus){
	/***********************************************************************
	 * The Node "class" is a quadruple linked list. All of the objects in the 
	 * game area will use this as the base prototype. Each node will have a 
	 * reference to the ones above, below, left, and right of it. It also keeps
     * track of weather or not this node excepts connections from those directions
	 ***********************************************************************/
	
	//all arrays go clockwise [up, right, down, left]
	var defaults = {connections:[null,null,null,null], connectionStatus:[0,0,0,0]};
	this._connections = connections || defaults.connections;
	this._connectionStatus  = connectionStatus || defaults.connectionStatus;
	
}

Node.prototype.setConnection = function (connectionIndex, connectionNode)
{	
	/***********************************************************************
	 * This lets you set or change the nodes linked to this node
	 ***********************************************************************/
	if(connectionIndex < this._connections.length){
		this._connections[connectionIndex] = connectionNode;
	}
	
}

Node.prototype.setConnectionStatus = function (connectionIndex, connectionStatus)
{
	/***********************************************************************
	 * This lets you set or change the ability of this node to connect to 
	 * the ones around it.
	 ***********************************************************************/
	if(connectionIndex < this._connectionStatus.length){
		this._connectionStatus[connectionIndex] = connectionStatus;
	}
	
}


Node.prototype.setConnectionStatusList = function (connectionStatus)
{
	/***********************************************************************
	 * This lets you set or change the ability of this node to connect to 
	 * the ones around it.
	 ***********************************************************************/
		this._connectionStatus = null;
		this._connectionStatus = connectionStatus;
	
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
// SETUP Pipe OBJECTS
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
var Pipe = Node.prototype.constructor;

Pipe.prototype.full = false;	
Pipe.prototype = new Node();

Pipe.prototype.rotate = function (direction){
	/***********************************************************************
	 * This will shift the values of the _connectionStatus array. it accepts
	 * either a 1 or 0 for the direction. 0 for clockwise, 1 for counter clockwise
	 * It defaults to clockwise.
	 ***********************************************************************/
	if(! this.full){
	if(direction != 0 && direction != 1 || typeof direction == 'undefined')
	{
		direction = 0;
	}
	
	var held;
	if(direction == 0){
		this._connectionStatus.unshift(this._connectionStatus.pop());
	}else{
		this._connectionStatus.push(this._connectionStatus.shift());
	}
	
	var newclass= this._connectionStatus.toString().replace(/,/g,"");
	this._htmlElement.find("span").removeClass().addClass("pipe-"+newclass);
	}
	
	
	
}

Pipe.prototype.fill = function(startConnectionIndex){
	/***********************************************************************
	 * This will gradually fill the pipe then call fill on the ones it is 
	 * connected too. If the fill starts from a spot that doesn't have a connection
	 * enabled the users losses.
	 ***********************************************************************/
	if(typeof startConnectionIndex != 'undefined' && !this.full )
	{
			var newclass= this._connectionStatus.toString().replace(/,/g,"");
			this._htmlElement.find("span").removeClass().addClass("pipe-"+newclass);
		if(startConnectionIndex == 1){
			this._htmlElement.find(".water").addClass("right");
		}else if(startConnectionIndex == 0){
			this._htmlElement.find(".water").addClass("verticle");
		}else if(startConnectionIndex == 2){
			this._htmlElement.find(".water").addClass("verticle").addClass("bottom");
		}
		
		
		
		if(this._connectionStatus[startConnectionIndex] == 1){
			this.full = true;
			var thispipe = this;
			
			var animationOptions ={width:"71px"};
			if(startConnectionIndex == 0){
				animationOptions ={'height':"71px"};
			} else if(startConnectionIndex == 2){
				animationOptions ={'margin-top':"-71px"};
				
			}
			
			thispipe._htmlElement.find(".water").animate(animationOptions,gameOptionsManager.fillSpeed, function(){
						thispipe._htmlElement.addClass("full");
						for(var i =0 ; i < thispipe._connectionStatus.length ;i ++)
						{
							var from = 0;
							if(i == 0){
								from = 2;
							}else if(i == 1){
								from = 3;
							}else if(i == 2){
								from = 0;
							}else if(i == 3){
								from = 1;
							}
							
						
							if(thispipe._connectionStatus[i] == 1 && i != startConnectionIndex){
								if(thispipe._connections[i] != null && typeof thispipe._connections[i] != 'undefined'){
									thispipe._connections[i].fill(from);
								}else if(gameOptionsManager.outOfPlayAreaKills){
									//lose :(
									gameOptionsManager.fillSpeed = 100;
									console.log("DEAD");
								}
							}
						}
			});
		}else{
			//lose :(
				gameOptionsManager.fillSpeed = 100;
				console.log("DEAD");
		}
	}
}
Pipe.prototype.setHTMLElement= function(element){
	/***********************************************************************
	 * 
	 ***********************************************************************/
	var eventname = "click";
	
	if(window.mobilecheck()){
		eventname = "touchstart";
	}
	this._htmlElement = element;
	this._htmlElement.bind( eventname ,this.clicked.bind(this));
}

Pipe.prototype.clicked = function(){
	/***********************************************************************
	 * 
	 ***********************************************************************/
	if(gameOptionsManager.additiveMode || gameOptionsManager.godMode){
		if(! this.full){
			if(gameOptionsManager.selectedPipeValue != null && typeof gameOptionsManager.selectedPipeValue != 'undefined'){
				this.setConnectionStatusList(gameOptionsManager.selectedPipeValue);
			}
		}
	}else{
		this.rotate();
	}
	
}

Pipe.prototype.setConnectionStatusList = function (connectionStatus)
{
	/***********************************************************************
	 * This lets you set or change the ability of this node to connect to 
	 * the ones around it.
	 ***********************************************************************/
	var pipeOptions = [
			[0,1,0,1],
			[0,0,1,1],
			[0,1,1,0],
			[1,1,0,0],
			[1,0,0,1],
			[0,1,1,0],
			[0,1,1,0],
			[0,1,1,0],
			[0,1,1,0],
			[0,1,1,0],
			[1,1,1,0]
		];
		
	if(connectionStatus != null && typeof connectionStatus != 'undefined'){
		this._connectionStatus = null;
		this._connectionStatus = connectionStatus;
	}else{
		var random = Math.floor(Math.random()*pipeOptions.length);	
		this._connectionStatus = null;
		this._connectionStatus = pipeOptions[random];
	}
	
	if(this._htmlElement != null && typeof this._htmlElement != 'undefined'){
		var newclass= this._connectionStatus.toString().replace(/,/g,"");
		this._htmlElement.find("span").removeClass().addClass("pipe-"+newclass);
	}
	
}

var WinPipe = function(){};
	WinPipe.prototype = new Pipe();
	WinPipe.prototype.fill = function(connectionIndex){
	console.log("WIN");
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
// SETUP GAME
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

var PipeGame = (function(){

	
	var _numCols = 8;
	var _numRows = 4;
	var _firstx = 0;
	var _firsty = 0;
	var _lastx = 3;
	var _lasty = 0;
	var _lastToFill;
	var _firstToFill;
	var _score = 0;
	var _numberOfPipesFilled = 0;
	var _fillSpeed = 3000;
	var _startTimer;
	var _autoStart = null;

	function _configure(options){
		/***************************************************************************************
		 * This sets all of the options
		 ***************************************************************************************/
		_numCols = options.cols;
		_numRows = options.rows;
		_firstx = options.startX;
		_firsty = options.StartY;
		_lastx = options.lastX;
		_lasty = options.lastY;
		_autoStart = options.autoStart || null;	
		gameOptionsManager.godMode = options.godMode || false;
		gameOptionsManager.additiveMode = options.additiveMode || false;
	}

	function _setGameBoard(level){
		/***************************************************************************************
		 * This populates the game board based on the number of rows and cols specified.
		 * I still need to add in the different pipe types and the ability to add blank spaces
		 ***************************************************************************************/		
		var prevTopNode;
		var prevCol = [];
		var topNode;
		var random;
		var pipeclasst;
		var pipeclass;
		var nodeAbove;
		var bottomNode;
		
		$(".plumbing").html("");
		
		if(typeof level != 'undefined'){
			
			_numCols = level.length;
			_numRows = level[0].length;
		}

		for(var i=0; i< _numCols; i++)
		{
			
			$(".plumbing").append("<ul class=\"col-"+ i +"\"></ul>");
			nodeAbove = null;
			for(var j = 0 ; j < _numRows; j++){
			
				bottomNode = new Pipe();
				if(i ==0 && j == 0){
					gameOptionsManager.topLeftPipe = bottomNode;
				}
				if(typeof level != 'undefined'){
					bottomNode.setConnectionStatusList(level[i][j]);
				}else{
					bottomNode.setConnectionStatusList();
				}
				
				pipeclass = "pipe-" + bottomNode._connectionStatus.toString().replace(/,/g,"");
				bottomNode.setHTMLElement($(".plumbing .col-" + i ).append("<li class=\"row-"+ j  +"\"><span class=\""+ pipeclass +"\"></span><div class=\"water\"></div></li>").find("li").last());
				
				if(nodeAbove != null && typeof nodeAbove != 'undefined'){
					bottomNode.setConnection(0, nodeAbove);
					nodeAbove.setConnection(2, bottomNode );
				}
				
				if(i > 0){
					
					bottomNode.setConnection(3, prevCol[j]);
					prevCol[j].setConnection(1, bottomNode);
				}
				
				
				if(i == _firstx && j == _firsty){
					
					_firstToFill = bottomNode;
			
				}
				if(i == _lastx && j == _lasty){
					_lastToFill  = bottomNode;
					_lastToFill.setConnection(1, new WinPipe());
				}
				
				prevCol[j] = bottomNode;
				nodeAbove = bottomNode;
			
			}	
			
			prevTopNode = topNode;
		}
		
		if(typeof _autoStart != 'undefined' && _autoStart != null){
			_startTimer = setTimeout(function(){_firstToFill.fill(3);},_autoStart);
		}
		
		_addButtonEvents();
	
	}
	
	function _addButtonEvents(){
		
		//This allows you to have a speed up button
		$(".speedUp").click(function(){
			gameOptionsManager.fillSpeed = 100;
		});
		
		//this is used by the level editor to select a tile
		if(gameOptionsManager.godMode){
			$(".plumbing-creator li").click(function(){
				gameOptionsManager.selectedPipeValue = $(this).attr("data-pipe").split(",");
			});
		}
		//this is used to start the water
		$(".start-water").click(function(){
			PipeGame.startWater();
		});
		
		//this sets up the random pipe generator if we are in additive mode
		if(gameOptionsManager.additiveMode == true){
			$(".plumbing li").click(_generatePipe);
			_generatePipe();
		}
	
	}
	
	function _generatePipe(){
		
		var pipeOptions = [
			[0,1,0,1],
			[1,0,1,0],
			[0,0,1,1],
			[0,1,1,0],
			[1,1,0,0],
			[1,0,0,1],
			[1,1,1,0],
			[0,1,1,1],
			[1,1,0,1],
			[1,0,1,1]
		];
		
		var num = Math.floor(Math.random()*pipeOptions.length);
		gameOptionsManager.selectedPipeValue = pipeOptions[num];
		var newclass= "pipe-" + pipeOptions[num].toString().replace(/,/g,"");
		$('.next-pipe span').removeClass().addClass(newclass);
	}
	
	function _startWater(){
		clearInterval(_startTimer);
		_firstToFill.fill(3);
	}
	function _generateJSON(){
		var json = [];
	$(".plumbing ul").each(function(i){
		json.push([])
		$(this).find("li").each(function(j){
			var val = $(this).find("span").first().attr("class");
			val = val.replace("pipe-","").split("");
			
;			json[i].push(val);
		});
	});
		console.log(JSON.stringify(json));
		return json;
	}
	
	
	return{
		setGameBoard:_setGameBoard,
		configure:_configure,
		fillSpeed: _fillSpeed,
		startWater: _startWater,
		generateJSON: _generateJSON
	}
	
})();
