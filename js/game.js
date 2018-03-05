
var game=document.getElementById("game");
var button=document.getElementById("button");
var score=document.getElementById("score");
var stars=document.getElementById("star");
var center=document.getElementById("center");
var high=document.getElementById("high");

var childs=[];
var scorelist=[];

function reset(){
    windowWidth=0;
    windowHeight=0;
    relX=3;
    relY=4;
    blocks=0;
    defaultWidth=45;
    defaultHeight=100/20;
    viewportWidth=0;
    viewportHeight=0;
    prevItem=null;
    currItem=null;
    vel=3;
    dir=1;
    lastTimeout=0;
    
    
    itemWidth=0;
    itemHeight=0;

    getViewPort();
    resetPoints(score);
    resetPoints(stars);
}




function getViewPort(){
    //// https://stackoverflow.com/questions/1248081/get-the-browser-viewport-dimensions-with-javascript
    windowWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    windowHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    
    viewportWidth=relX*100;
    viewportHeight=relY*100;


    game.style.width=viewportWidth+"px";
    game.style.height=viewportHeight+"px";
    game.style.left=((windowWidth-viewportWidth)/2)+"px";
    game.style.top=((windowHeight-viewportHeight)/2)+"px";

    center.style.height=viewportHeight+"px";
    high.style.height=viewportHeight+"px";

    itemHeight=Math.round(viewportHeight*defaultHeight/100);
    itemWidth=Math.round(viewportWidth*defaultWidth/100);

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


function message(title,text){
    var message=title;
    if (text){
        message+=" \n"+text;
    }
    alert(message);
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
                if (itemWidth<2){
                    currItem.style.backgroundColor="#F88";
                    message("You loose.",score.innerText+" pts.");
					registerScore();
                    center.style.display='';
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
                    addPoints(score,itemWidth);
                    addPoints(stars,1);
                }
                if (blocks==19 && itemWidth>=2){
                    message("You Win!!",score.innerText+" pts. "+stars.innerText+" stars");
                    currItem.style.backgroundColor="#FFF";
                    center.style.display='';
					registerScore();
                    return;
                }
                addPoints(score,itemWidth);
                
                vel+=0.5;
            }
            nextBlock();
        },1000);
    }
}

function addPoints(elem,points){
    elem.innerHTML=elem.innerText*1+Math.round(points);
}

function resetPoints(elem){
    elem.innerHTML=0;
}
    

function start(){
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
    console.log([blocks,vel,itemWidth]);
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
	var hs=localStorage.getItem("hsc");
	if (hs){
		scorelist=JSON.parse(hs);
	}
	scorelist.push(score.innerText*1);
	scorelist.sort(function(a, b){return b-a});
	while(scorelist.length>5){
		scorelist.pop();
	}
	localStorage.setItem("hsc",JSON.stringify(scorelist));
	document.getElementById("scorelist").innerHTML=scorelist.join("\n");
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
