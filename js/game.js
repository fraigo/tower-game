
var game=document.getElementById("game");
var button=document.getElementById("button");
var score=document.getElementById("score");
var level=document.getElementById("level");
var stars=document.getElementById("star");
var center=document.getElementById("center");
var high=document.getElementById("high");
var title=document.getElementById("title");
var currentLevel=1;

var childs=[];
var scorelist=[];
var gameStart,gameEnd,gameTime;
var factor=100;
var maxBlocks=18;

function reset(){
    windowWidth=0;
    windowHeight=0;
    relX=3;
    relY=4;
    blocks=0;
    defaultWidth=45;
    defaultHeight=5;
    defaultVel=3;
    viewportWidth=0;
    viewportHeight=0;
    prevItem=null;
    currItem=null;
    vel=defaultVel;
    dir=1;
    lastTimeout=0;
    factor=100;
    
    
    itemWidth=0;
    itemHeight=0;

    if (currentLevel>=2){
        defaultHeight-=currentLevel;
        if (defaultHeight<1){
            defaultHeight=1;
        }
        vel++;
    }

    getViewPort();
    setText(level,currentLevel);
    if (currentLevel==1){
        setText(score,0);
        setText(stars,0);    
    }
}




function getViewPort(){
    //// https://stackoverflow.com/questions/1248081/get-the-browser-viewport-dimensions-with-javascript
    windowWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    windowHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    
    windowRatio=windowWidth/windowHeight;
    relRatio=relX/relY;
    //console.log(windowRatio,relRatio);
    
    factor=100;
    if (relRatio>windowRatio){
        factor=Math.round(windowWidth/relX);
    }else{
        factor=Math.round(windowHeight/relY);
    }
    
    viewportWidth=relX*factor;
    viewportHeight=relY*factor;

    //console.log([viewportWidth,viewportHeight,windowWidth,windowHeight,window.innerWidth,window.innerHeight]);


    game.style.width=viewportWidth+"px";
    game.style.height=viewportHeight+"px";
    game.style.left=((windowWidth-viewportWidth)/2)+"px";
    game.style.top=(Math.abs(windowHeight-viewportHeight)/2)+"px";

    center.style.height=viewportHeight+"px";
    high.style.height=viewportHeight+"px";

    itemHeight=Math.round(viewportHeight*defaultHeight/100);
    itemWidth=Math.round(viewportWidth*defaultWidth/100);
    itemPoints=defaultWidth*100;
    maxBlocks=Math.floor((viewportHeight-30)/(itemHeight));

}


window.onresize=function(){
    //getViewPort();
}

window.document.onmouseup=function(){
    stop();
}

window.document.onkeyup=function(ev){
       stop();
}


function nextStage(){

}

function message(msg,text){
    if (text){
        msg+=" <br>"+text;
    }
	setText(title,msg);
}

function stop(){
    if (lastTimeout){
        window.clearTimeout(lastTimeout);
        lastTimeout=0;
        setTimeout(function(){
            if (prevItem){
                var currentPos=currItem.style.left.split("p")[0]*1;
                var prevStart=prevItem.style.left.split("p")[0]*1;
                var prevEnd=prevStart+prevItem.style.width.split("p")[0]*1;
                
                itemWidth=Math.round(itemWidth-Math.abs(prevStart-currentPos));
                itemPoints=Math.round(itemWidth*100*100/viewportWidth);
                if (itemPoints<50){
                    currItem.style.backgroundColor="#F88";
                    message("You loose!",score.innerText+" pts.");
					registerScore();
                    center.style.display='';
                    currentLevel=1;
                    button.innerHTML="New Game";
                    return;
                }
                if (currentPos>prevStart){
                    currItem.style.width=itemWidth+"px";
                }else if (currentPos<prevStart){
                    currItem.style.width=itemWidth+"px";
                    currItem.style.left=currentPos+Math.abs(prevStart-currentPos)+"px";
                }
                if(Math.round(currentPos)==Math.round(prevStart)){
                    currItem.style.backgroundColor="#8F8";
                    addPoints(score,itemPoints);
                    addPoints(stars,1);
                }
                if (blocks==maxBlocks && itemPoints>=50){
                    message("Level Completed!",score.innerText+" pts.<br>"+stars.innerText+" stars");
                    currItem.style.backgroundColor="#FFF";
                    center.style.display='';
                    registerScore();
                    currentLevel++;
                    button.innerHTML="Level "+currentLevel;
					return;
                }
                addPoints(score,itemPoints);
                
                vel+=0.25;
            }
            nextBlock();
        },1000);
    }
}

function addPoints(elem,points){
    elem.innerHTML=elem.innerText*1+Math.round(points);
}

function setText(elem,data){
    elem.innerHTML=data;
}
    

function start(){
	gameStart=(new Date()).getTime();
    reset();
    for(var i=0;i<childs.length;i++){
        game.removeChild(childs[i]);
    }
    childs=[];
    center.style.display='none';
    nextBlock();
}

function nextBlock(){
    blocks++;
    prevItem=currItem;
    currItem=document.createElement("div");
    currItem.style.position="absolute";
    currItem.style.width=itemWidth+"px";
    currItem.style.height=(itemHeight-2)+"px";
    currItem.className="bar";
    currItem.style.top=(viewportHeight-itemHeight*blocks)+"px";
    childs.push(currItem);
    game.appendChild(currItem);
    console.log([blocks,vel,itemWidth,itemPoints]);
    move(currItem,0,vel);
}

function move(item,start,vel){
    if (start+itemWidth>=viewportWidth){
        start=viewportWidth-itemWidth;
        dir=dir*-1;
    }
    if (start<0){
        start=0;
        dir=dir*-1;
        vel=Math.min(vel+1,15);
    }
    item.style.left=start+"px";
    
    lastTimeout=setTimeout(move,30,item,start+vel*dir,vel);
}

function exportImage(){
    var ignored=document.getElementsByClassName("overlay");
    for(var i=0;i<ignored.length;i++){
        ignored[i].style.visibility='hidden';
    }
    html2canvas(document.querySelector("#game")).then(canvas => {
        var link=document.createElement("a");
        link.href=canvas.toDataURL();
        link.download="tower-game-"+score.innerText;
        link.appendChild(canvas);
        link.style.display='none';
        document.body.appendChild(link);
        link.click();
        for(var i=0;i<ignored.length;i++){
            ignored[i].style.visibility='';
        }
    });
}

function registerScore(){
	gameEnd=(new Date()).getTime;
	gameTime=gameStart?(gameEnd-gameStart):0;
	var hs=localStorage.getItem("localscore");
	if (hs){
		scorelist=JSON.parse(hs);
	}
	scorelist.push({
        points:score.innerText,
        stars:stars.innerText,
        time:gameTime,
        level:currentLevel,
    });
    scorelist.sort(function(a, b){return b.points*b.level*10000000-a.points*a.level*10000000});
	while(scorelist.length>5){
		scorelist.pop();
	}
	localStorage.setItem("localScore",JSON.stringify(scorelist));
	var content="";
	for(var i=0;i<scorelist.length;i++){
		content+="Lv "+(scorelist[i].level?scorelist[i].level:1);
		content+="  ";
		content+=scorelist[i].points.padStart(6,"0");
		content+="  ";
		content+=scorelist[i].stars.padStart(2," ")+"★";
		content+="\n";
	}
	document.getElementById("scorelist").innerHTML=content;
}

function showScreen(hash){
	if (hash=="highscores"){
		high.style.display='';
		center.style.display='none';
	}else{
		high.style.display='none';
		center.style.display='';
	}
}

reset();

registerScore();
showScreen(document.location.hash);
