
var Game=function(ele){
	window.games=(window.games||0)+1
	window["game-"+window.games]=this;
	ele.innerHTML=`
<canvas id="game-canvas-for-${window.games}"></canvas>
<textarea id="game-coding-area-for-${window.games}"></textarea>
<button id="game-run-button-for-${window.games}">Run</button>
`;
	this.ctx=document.getElementById("game-canvas-for-"+window.games).getContext("2d");
	this.code=document.getElementById("game-coding-area-for-"+window.games);
	this.runButton=document.getElementById("game-run-button-for-"+window.games);
	this.entity=function(pos,vel,mass,img){
		this.id="Anonymous"
		this.type="entity";
		this.game=window["game-"+window.games];
		this.pos=pos;
		this.vel=vel;
		this.mass=mass;
		this.img=new Image();
		this.img.src=img;
		this.force=function(o){
			this.vel.add(window["game-"+window.games].Vec.div(o,this.mass));
		};
		this.update=function(){
			this.eval(this.behave);
			this.pos.add(this.vel);
			this.game.ctx.drawImage(this.img,this.pos.x,this.pos.y-this.pos.z/10);
		};
		this.codePointer=0;
		this.eval=function(str){
			console.log(str);
			console.log(this.codePointer);
			/*
				A new coding lang called clc.
				Syntax:
					Do something:
					<object> <do> [args]
					Goto:
					goto <line> if <line>
					Plain data:
					<data>
					Arbitary JS:
					comp <exp> <line>
					Comment:
					// [comments]
				So you should say something like this:
					hero findNearestItem 5
					goto 3 if 5
					hero move 5
					goto 0 if 4
					1

				That means:
					while True:
						item=hero.findNearestItem()
						if item:
							hero.moveTo(item)#?
			*/
			let line=function(l){
				return str[l];
			}
			let command=str[this.codePointer].split(" ");
			switch(command[0]){
				case "goto":
					if(str[command[3]]==="1"){
						this.codePointer=parseInt(command[1]);
					}
					break;
				case "comp":
					let a=eval(command[1])
					if(a){
						str[command[2]]=a;
					}
				case "//":
					break;
				default:
					if(command.length===1){
						break;
					}
					let com=command.concat([])
					com.shift();
					com.shift();
					eval(command[0]+"."+command[1]+"("+com.join()+")")
					break;
			}
		}
		this.maxSpeed=10;
		this.maxHealth=100;
		this.health=this.maxHealth;
		this.attackDamage=7;
		this.attackRange=3;
		this.cleaveDamage=115.7;
		this.cleaveRange=10;
		this.team="decoration"
		this.moveXY=function(x,y){
			let xo=(x-this.pos.x)/Math.sqrt((x-this.pos.x)*(x-this.pos.x)+(y-this.pos.y)*(x-this.pos.y))*this.maxSpeed;
			let yo=(y-this.pos.y)/Math.sqrt((x-this.pos.x)*(x-this.pos.x)+(y-this.pos.y)*(x-this.pos.y))*this.maxSpeed;
			this.vel.x=xo/100;
			this.vel.y=yo/100;
			let time=new Date.getTime()
			while(this.distanceTo({pos:{x:x,y:y}})>1 && new Date.getTime()-3000<st){}
			if(new Date.getTime()-3000<st){
				throw this.id+":I can't get there!";
			}else{
				this.vel.x=0;
				this.vel.y=0;
			}
		};
		this.findByTeam=function(t){
			let f=[]
			for(let i in this.game.entities){
				if(this.game.entities[i].team===t){
					f.push(this.game.entities[i])
				}
			}
			return f
		}
		this.findItems=function(){
			return this.findByTeam("collectable");
		}
		this.findEnemies=function(){
			return this.findByTeam("ogres");
		}
		this.findFriends=function(){
			return this.findByTeam("humans");
		}
		this.findByType=function(){
			let f=[]
			for(let i in this.game.entities){
				if(this.game.entities[i].type===t){
					f.push(this.game.entities[i])
				}
			}
			return f
		}
		this.findNearest=function(l){
			let minDist=9001;
			let minE=null;
			for(let i in l){
				if(this.distanceTo(l[i])<minDist){
					minDist=this.distanceTo(l[i]);
					minE=l[i]
				}
			}
			return minE
		}
		this.move=function(u){
			var x=u.x;
			var y=u.y;
			let xo=(x-this.pos.x)/Math.sqrt((x-this.pos.x)*(x-this.pos.x)+(y-this.pos.y)*(x-this.pos.y))*this.maxSpeed;
			let yo=(y-this.pos.y)/Math.sqrt((x-this.pos.x)*(x-this.pos.x)+(y-this.pos.y)*(x-this.pos.y))*this.maxSpeed;
			this.pos.x+=xo/100;
			this.pos.y+=yo/100;
		};
		this.distanceTo=function(u){
			return Math.sqrt((u.pos.x-this.pos.x)*(u.pos.x-this.pos.x)+(u.pos.y-this.pos.y)*(u.pos.x-this.pos.y));;
		};
		this.attack=function(u){
			this.moveXY(u.pos.x,u.pos.y);
			if(this.distanceTo(u)<this.attackRange){
				u.health-=this.attackDamage;
			}
		};
		this.cleave=function(){
			for(let i in this.entities){
				if(this.distanceTo(this.entities[i])<this.cleaveRange){
					this.entities[i].health-=this.cleaveDamage;
				}
			}
		};
		this.shield=function(){
			this.health+=(this.maxHealth-this.health)/30;
		};
		this.behave=""
	};
	this.entities=[];
	this.goals=[];
	this.player=null;
	this.codePointer=0;
	this.eval=function(str){
		/*
			A new coding lang called clc.
			Syntax:
				Do something:
				<object> <do> [args]
				Goto:
				goto <line> if <line>
				Plain data:
				<data>
				Arbitary JS:
				comp <exp> <line>
				Comment:
				// [comments]
			So you should say something like this:
				hero nearestItem 5
				goto 3 if 5
				hero moveTo 5
				goto 0 if 4
				1
				
			That means:
				while True:
					item=hero.findNearestItem()
					if item:
						hero.moveTo(item)#?
		*/
		let line=function(l){
			return str[l];
		}
		let command=str[this.codePointer].split(" ");
		switch(command[0]){
			case "goto":
				if(str[command[3]]==="1"){
					this.codePointer=parseInt(command[1]);
				}
				break;
			case "comp":
				let a=eval(command[1])
				if(a){
					str[command[2]]=a;
				}
			case "//":
				break;
			default:
				if(command.length===1){
					break;
				}
				let com=command.concat([])
				com.shift();
				com.shift();
				window.player=this.player;
				eval("player."+command[1]+"("+com.join()+")");
				delete window.player;
				break;
		}
	}
	this.runButton.onclick=function(){
		window["game-"+window.games].runningCode=window["game-"+window.games].code.value.split(";");
		window["game-"+window.games].startTime=new Date().getTime();
		window["game-"+window.games].run=setInterval(function(){
			window["game-"+window.games].ctx.clearRect(0, 0, document.getElementById("game-canvas-for-"+window.games).width, document.getElementById("game-canvas-for-"+window.games).height);
			window["game-"+window.games].codePointer++;
			try{
				window["game-"+window.games].eval(window["game-"+window.games].runningCode);
			}catch(e){
				console.log(e);
			}
			for(let i in window["game-"+window.games].entities){
				for(let j in window["game-"+window.games].entities){
					if(i==j){
						continue;
					}
					window["game-"+window.games].entities[i].force(Math.floor(Math.sqrt(
						(window["game-"+window.games].entities[i].pos.x-window["game-"+window.games].entities[j].pos.x)*
						(window["game-"+window.games].entities[i].pos.x-window["game-"+window.games].entities[j].pos.x)+
						(window["game-"+window.games].entities[i].pos.y-window["game-"+window.games].entities[j].pos.y)*
						(window["game-"+window.games].entities[i].pos.y-window["game-"+window.games].entities[j].pos.y)+
						(window["game-"+window.games].entities[i].pos.z-window["game-"+window.games].entities[j].pos.z)*
						(window["game-"+window.games].entities[i].pos.z-window["game-"+window.games].entities[j].pos.z)
					)));
				}
				window["game-"+window.games].entities[i].update();
			}
			let f=true;
			for(let i in window["game-"+window.games].goals){
				f=f&&window["game-"+window.games].goals[i][1]();
			}
			if(f){
				window["game-"+window.games].ctx.fillStyle= "purple";
    				window["game-"+window.games].ctx.font = "50px Arial";
				window["game-"+window.games].ctx.textAlign="center";
    				window["game-"+window.games].ctx.fillText("You Won!", document.getElementById("game-canvas-for-"+window.games).width/2, document.getElementById("game-canvas-for-"+window.games).height/2);
				clearInterval(window["game-"+window.games].run);
			}
			if(window["game-"+window.games].startTime+120000>new Date().getTime()){
				window["game-"+window.games].ctx.fillStyle= "purple";
    				window["game-"+window.games].ctx.font = "50px Arial";
				window["game-"+window.games].ctx.textAlign="center";
    				window["game-"+window.games].ctx.fillText("Out Of Time", document.getElementById("game-canvas-for-"+window.games).width/2, document.getElementById("game-canvas-for-"+window.games).height/2);
				clearInterval(window["game-"+window.games].run);
			}
		},1000);
	};
	this.addGoal=function(t,f){
		this.goals.push([t,f]);
	};
	this.spawnPlayer=function(x,y){
		this.player=this.player||new (this.entity)(new (this.Vec)(x,y,0),new (this.Vec)(0,0,0),10,"/assets/hero.png");
		this.player.id="Hero";
		return this.player;
	};
	this.spawnXY=function(img,x,y){
		let a=new (this.entity)(new (this.Vec)(x,y,0),new (this.Vec)(0,0,0),10,"/assets/"+img+".png");
		this.entities.push(a);
		return a;
	};
	setInterval("window['game-'+window.games].code.value=window['game-'+window.games].originalCode",10)
	this.Vec=function(x,y,z){
		this.x=x;
		this.y=y;
		this.z=z;
		this.add=function(o){
			this.x+=o.x;
			this.y+=o.y;
			this.z+=o.z;
		}
		this.sub=function(o){
			this.x-=o.x;
			this.y-=o.y;
			this.z-=o.z;
		}
		this.mult=function(o){
			this.x*=o;
			this.y*=o;
			this.z*=o;
		}
		this.div=function(o){
			this.x/=o;
			this.y/=o;
			this.z/=o;
		}
	}
	this.Vec.add=function(a,b){
		return new (Game.prototype.Vec)(a.x+b.x,a.y+b.y,a.z+b.z);
	}
	this.Vec.sub=function(a,b){
		return new (Game.prototype.Vec)(a.x-b.x,a.y-b.y,a.z-b.z);
	}
	this.Vec.mult=function(a,b){
		return new (Game.prototype.Vec)(a.x*b,a.y*b,a.z*b);
	}
	this.Vec.div=function(a,b){
		return new (Game.prototype.Vec)(a.x/b,a.y/b,a.z/b);
	}
}

