
var game=document.getElementById("game");
var button=document.getElementById("button");
var score=document.getElementById("score");
var childs=[];

function reset(){
    windowWidth=0;
    windowHeight=0;
    relX=3;
    relY=4;
    blocks=0;
    defaultWidth=48;
    defaultHeight=100/20;
    viewportWidth=0;
    viewportHeight=0;
    prevItem=null;
    currItem=null;
    vel=3;
    dir=1;
    lastTimeout=0;
    button.style.display='';
    
    itemWidth=0;
    itemHeight=0;

    getViewPort();
    score.innerHTML=0;
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

    itemHeight=Math.round(viewportHeight*defaultHeight/100);
    itemWidth=Math.round(viewportWidth*defaultWidth/100);

}



window.onresize=function(){
    getViewPort();
}

window.document.onmouseup=function(){
    stop();
}

window.document.onkeyup=function(ev){
       stop();
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
                
                itemWidth=itemWidth-Math.abs(prevStart-currentPos);
                if (itemWidth<0){
                    alert("You loose");
                    reset();
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
                    addScore(itemWidth);
                }
                addScore(itemWidth);
                
                vel+=0.5;
            }
            nextBlock();
        },1000);
    }
}

function addScore(points){
    score.innerHTML=score.innerText*1+Math.round(itemWidth);
}
    

function start(){
    for(var i=0;i<childs.length;i++){
        game.removeChild(childs[i]);
    }
    childs=[];
    button.style.display='none';
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

reset();