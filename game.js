
var game=document.getElementById("game");
var button=document.getElementById("button");
var score=document.getElementById("score");

function reset(){
    w=0;
    h=0;
    ax=3;
    ay=4;
    blocks=0;
    bwp=48;
    bhp=100/20;
    nw=0;
    nh=0;
    prevItem=null;
    currItem=null;
    vel=3;
    dir=1;
    lastTimeout=0;
    button.style.display='';
}




function getViewPort(){
    //// https://stackoverflow.com/questions/1248081/get-the-browser-viewport-dimensions-with-javascript
    w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    
    nw=ax*100;
    nh=ay*100;

    game.style.width=nw+"px";
    game.style.height=nh+"px";
    game.style.left=((w-nw)/2)+"px";
    game.style.top=((h-nh)/2)+"px";

    bh=Math.round(nh*bhp/100);
    bw=Math.round(nw*bwp/100);

}

document.body.onload=function(){
    getViewPort();
    
}

window.onresize=function(){
    getViewPort();
}

window.document.onmouseup=function(){
    stop();
}

window.document.onkeyup=function(ev){
    console.log(ev.keyCode);
    if (ev.keyCode==32){
        stop();
    }
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
                
                bw=bw-Math.abs(prevStart-currentPos);
                if (bw<0){
                    alert("You loose");
                    return;
                }
                if (currentPos>prevStart){
                    currItem.style.width=bw+"px";
                }else if (currentPos<prevStart){
                    currItem.style.width=bw+"px";
                    currItem.style.left=currentPos+Math.abs(prevStart-currentPos)+"px";
                }
                if(Math.round(currentPos)==Math.round(prevStart)){
                    currItem.style.backgroundColor="#8F8";
                    addScore(bw);
                }
                addScore(bw);
                
                vel+=0.5;
            }
            nextBlock();
        },1000);
    }
}

function addScore(points){
    score.innerHTML=score.innerText*1+Math.round(bw);
}
    

function start(){
    nextBlock();
    button.style.display='none';
}

function nextBlock(){
    blocks++;
    prevItem=currItem;
    currItem=document.createElement("div");
    currItem.style.position="absolute";
    currItem.style.width=bw+"px";
    currItem.style.height=(bh-2)+"px";
    currItem.className="bar";
    currItem.style.top=(nh-bh*blocks)+"px";
    game.appendChild(currItem);
    console.log([blocks,vel,bw]);
    move(currItem,0,vel);
}

function move(item,start,vel){
    if (start+bw>=nw){
        start=nw-bw;
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