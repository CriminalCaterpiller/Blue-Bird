width = 500; height = 500;
displayWidth = 500; displayHeight = 500;
c = document.createElement("canvas");
displayC = document.createElement("canvas");
displayC.width = width; 
displayC.height = height;
displayCtx = displayC.getContext("2d");
document.body.appendChild(displayC);
c.width = width; c.height = height;

ctx = c.getContext("2d");

displayCtx.fillStyle = "#000000";
displayCtx.fillRect(0,0,
displayC.width,displayC.height);

paused = false;

Menu = function(){
this.buttons = [];
this.name = "untitled";
this.selected=0;
this.downPress = false;
this.upPress = false;
this.selectPress = false;
this.loop = function(){
this.update();
this.display();
}
this.update = function(){
if (this.downPress) this.selected++;
if (this.upPress) this.selected--;
if (this.selected>=this.buttons.length)
this.selected = 0;
if (this.selected<0)
this.selected = this.buttons.length-1;
for (i = 0; i < this.buttons.length; i++){
if (this.selected == i && this.selectPress) {
this.buttons[i].f();
}
}
this.downPress = false;
this.upPress = false;
this.rightPress = false;
this.leftPress = false;
this.selectPress = false;
}
this.display = function(){
ctx.fillStyle = "#000000";
ctx.globalAlpha = .5;
ctx.fillRect(0,0,c.width,c.height);
ctx.globalAlpha = 1;
for (i = 0; i < this.buttons.length; i++){
this.buttons[i].y = 150 + i*60;
if (this.selected == i)
this.buttons[i].selected = true;
else
this.buttons[i].selected = false;
this.buttons[i].display();
}
if (this.name != undefined)
drawCenteredText(this.name,100,6);
}
}

settings = {
volume:10
};

openSettings = function(){
menu = new Menu();
menu.name = " Sweet dreams ";
menu.loop = function(){
if (this.selected == 1){
menu.buttons[1].label = "volume " + settings.volume;
if (this.rightPress && settings.volume<100) 
settings.volume+=2;
if (this.leftPress && settings.volume > 1) 
settings.volume-=2;
}
menu.update();
menu.display();
}
menu.buttons=[
new Button(function(){openMenu();},0,150,45,
"back"),
new Button(function(){},0,150,45,
"volume ")
];
menu.buttons[1].label = "volume " + settings.volume;
}

menu = {};

openMenu = function(){
menu = new Menu();
menu.name=" DEAR READER ";
//menu.selected = 1;
menu.buttons=[
new Button(
function(){closeMenu()},
0,150,45,"resume"
),
new Button(
function(){openSettings()},
0,150,45,"settings"
)
];
paused = true;
}

closeMenu = function(){
menu = {};
paused = false;
}

drawCenteredText = function(words,y,s){
size = s*s;
ctx.font = size +"px Courier";
ctx.fillStyle = "#111111";
ctx.fillText(words,
250-words.length*size/4-size*.5,y);
ctx.fillStyle = "#eeeeee";
ctx.fillText(words,
250-words.length*size/4-size*.5,
y-s/2);
}

Button = function(f,y,w,h,label){
this.x = 250-w/2; this.y = y;
this.w = w; this.h = h;
this.f = f;
this.label = label;
this.labelSize = 5;
if (label==undefined) this.label = "";
this.dX = this.x; this.dY = this.y;
this.dW = this.w; this.dH = this.h;
this.normalColor = "#888888";
this.hoverColor = "#777777";
this.selected = false;
this.color = this.normalColor;
this.update = function(){
if (this.hovered) {
this.color = this.hoverColor;
}}
this.display = function(){
ctx.fillStyle = this.normalColor;
if (this.selected){
ctx.fillRect(this.x-this.w*.1,this.y-this.h*.1,
this.w*1.2,this.h*1.2);
drawCenteredText(this.label,
this.y+this.h/2+this.labelSize*1.2,this.labelSize*1.1);
}else{
ctx.fillRect(this.x,this.y,this.w,this.h);
drawCenteredText(this.label,
this.y+this.h/2+this.labelSize,this.labelSize);
}}}

sounds = [];

GameLoop = function(){
if(window.innerHeight != screen.height){
displayC.width = displayWidth;
displayC.height = displayHeight;
}else{
displayC.width = screen.height*c.width/c.height;  
displayC.height = screen.height;
}
if (paused) {room.display(); menu.loop();}
else room.loop();
if (changing) changeLoop();
displayCtx.drawImage(c,0,0,
displayWidth,displayHeight);
}

fade = false;
fadeAlpha = 0;
changing = false;
changingRoom = {};
changeRoom = function(newRoom){
changingRoom = newRoom;
changing = true; fade = true;
room.update = function(){}
}

changeLoop = function(){
displayFade(.05);
if (fadeAlpha>=1){
fade = false; room = changingRoom;
}
if (!fade && Math.floor(fadeAlpha*10)/10 == 0)
changing = false;
}

displayFade = function(speed){
if (fade && fadeAlpha < 1)fadeAlpha+=speed;
if (!fade && fadeAlpha > 0)fadeAlpha-=speed;
ctx.fillStyle = "#000000";
ctx.globalAlpha = fadeAlpha;
ctx.fillRect(0,0,c.width,c.height);
ctx.globalAlpha = 1;
}

makeObj = function(x,y,w,h){
return {x:x,y:y,w:w,h:h,clr:"#ff0000",
display:displayEntity};   
}

function Room(){
this.x = 0; this.y = 0;
this.w = 1000; this.h = 1000;
this.cameraX = 0; this.cameraY = 0;
this.obstacles = [];
this.entitys = [];
this.loop = function(){
this.update();
this.display();
}

this.moveCameraX = function(obj){
cX = obj.x + obj.w/2 - c.width/2;
if(0>obj.x + obj.w/2 - c.width/2)
cX = 0;
if(obj.x+obj.w/2-c.width/2>this.w-c.width)
cX = this.w-c.width;
this.cameraX = cX;
}
this.moveCameraY = function(obj){
cY = obj.y + obj.h/2 - c.height/2;
if(0>obj.y + obj.h/2 - c.height/2)
cY = 0;
if(obj.y+obj.h/2-c.height/2>this.h-c.height)
cY = this.h-c.height;
this.cameraY = cY;
}

this.displayEntitys = function(){
for (i = 0; i < this.entitys.length; i++){
this.entitys[i].x -= this.cameraX;
this.entitys[i].y -= this.cameraY;
this.entitys[i].display(this);
this.entitys[i].x += this.cameraX;
this.entitys[i].y += this.cameraY;
}}

this.border = function(obj){
if (obj.x<0)
obj.x=0;
if (obj.x+obj.w>this.w)
obj.x=this.w-obj.w;
if (obj.y<0)
obj.y=0;
if (obj.y+obj.h>this.h)
obj.y=this.h-obj.h;
}

this.collideObstacles = function(obj){
for (obs = 0; obs < this.obstacles.length; obs++){    
if (obj != this.obstacles[obs])
collideRect(obj,this.obstacles[obs]);
}}

this.hitTestObstacles = function(obj){
for (obs = 0; obs < this.obstacles.length; obs++){   
if (obj != this.obstacles[obs] &&
hitTestRect(obj,this.obstacles[obs])) return true;
}
return false;
}

this.update = function(){}
this.display = function(){
displayArray(this.entitys);
}
}

function fullscreen(){
if(displayC.webkitRequestFullScreen) {
displayC.webkitRequestFullScreen();
}
else {
displayC.mozRequestFullScreen
}
displayC.width = screen.height*c.width/c.height;  
displayC.height = screen.height;     
}

displayEntity = function(){
ctx.fillStyle = this.color;
if (this.alpha != undefined)
ctx.globalAlpha = this.alpha;
ctx.fillRect(this.x,this.y,this.w,this.h);
ctx.globalAlpha = 1;
}

function hitTestRectCoords(x1, y1, w1, h1, x2, y2, w2, h2){
if(w1 > 0 && h1 > 0 && w2 > 0 && h2 > 0 &&
x1 < x2 + w2 && x2 < x1 + w1 &&
y1 < y2 + h2 && y2 < y1 + h1)
return true;
return false;
}

function hitTestRect(obj1, obj2){
return hitTestRectCoords(obj1.x,obj1.y,obj1.w,obj1.h,
    obj2.x,obj2.y,obj2.w,obj2.h);
}
/*
addToArray = function(elm,arr){
tempArr = new Array(arr.length+1);
for (i = 0; i < arr.length; i++){
tempArr[i] = arr[i];}
tempArr[arr.length] = elm;
return tempArr;
}

removeFromArray = function(place,arr){
apperance = 0;
tempArr = new Array(arr.length-1);
for(i = 0; i < tempArr.length; i++){
if (place == i) apperance++;
else tempArr[i-apperance] = arr[i];
}
return tempArr;
}
*/

addToArray = function(elm,arr){
for (i = 0; i < arr.length; i++){
if (arr[i]==undefined) {
arr[i] = elm; return;
}}}

function collideRectCoords(obj1, w1, h1, obj2, w2, h2){
if (hitTestRectCoords(obj1.x, obj1.y, w1, h1, obj2.x, obj2.y, w2, h2)){
this.xPen = 0;
this.yPen = 0;
if (obj1.x<obj2.x){
xPen = obj1.x + w1 - obj2.x;
}else{
xPen = obj2.x + w2 - obj1.x;
}
if (obj1.y<obj2.y){
yPen = obj1.y + h1 - obj2.y;
}else{
yPen = obj2.y + h2 - obj1.y;
}
if (xPen > yPen){
if (obj1.y > obj2.y){
obj1.y += yPen;
}else{
obj1.y -= yPen;
}}else{
if (obj1.x > obj2.x){
obj1.x += xPen;
}else{
obj1.x -= xPen;
}}}}

function collideRect(obj1, obj2){
collideRectCoords(obj1,obj1.w,obj1.h,
obj2,obj2.w,obj2.h);
}

function hitTestRadCoords(x1,y1,r1,x2,y2,r2){
if (Math.sqrt(Math.pow(x2+r2-x1-r1,2) + Math.pow(-y2-r2+y1+r1,2)) < r1+r2
&& hitTestRectCoords(x1, y1, r1*2, r1*2, x2, y2, r2*2, r2*2))
return true;
return false;
}

function collideRadCoords(obj1,r1,obj2,r2){
this.angle = Math.atan2(obj1.y+r1-obj2.y-r2,
obj1.x+r1-obj2.x-r2);
if (hitTestRadCoords(obj1.x,obj1.y,r1,obj2.x,obj2.y,r2)){
this.xPen = (Math.cos(Math.PI+angle)*r1 + obj1.x + r1) -
(Math.cos(angle)*r2 + obj2.x + r2);
this.yPen = (Math.sin(Math.PI+angle)*r1 + obj1.y + r1) -
(Math.sin(angle)*r2 + obj2.y + r2);
//obj1.x -= xPen;obj1.y -= yPen;
obj1.x -= xPen/2;obj1.y -= yPen/2;
obj2.x += xPen/2;obj2.y += yPen/2;
obj1.yVel -= yPen/2; obj2.yVel += yPen/2;
}}

collideRad = function(obj1,obj2){
return collideRadCoords(obj1,obj1.r,obj2,obj2.r);
}

lineOfSight = function(obj,target,obs){
slope=(target.y+target.h/2-obj.y-obj.h/2)/
(target.x+target.w/2-obj.x-obj.w/2);
x=target.x+target.w/2;y=target.y+target.h/2;
for (i = 0; i < obs.length; i++){
tempX=(obs[i].y-obj.y-obj.h/2)/
slope+obj.x+obj.w/2;
tempY=(obs[i].x-obj.x-obj.w/2)*
slope+obj.y+obj.h/2;
if (tempY>=obs[i].y &&
tempY<=obs[i].y+obs[i].h &&
(obj.x+obj.w/2<obs[i].x &&
obs[i].x<target.x+target.w/2 ||
obj.x+obj.w/2>obs[i].x && 
obs[i].x>target.x+target.w/2)
){return false;x=obs[i].x;y=tempY;}
if (tempX>=obs[i].x &&
tempX<=obs[i].x+obs[i].w &&
(obj.y+obj.h/2<obs[i].y &&
obs[i].y<target.y+target.h/2 ||
obj.y+obj.h/2>obs[i].y && 
obs[i].y>target.y+target.h/2)
){return false;y=obs[i].y;x=tempX;}
tempX=(obs[i].y+obs[i].h-obj.y-obj.h/2)/
slope+obj.x+obj.w/2;
tempY=(obs[i].x+obs[i].w-obj.x-obj.w/2)*
slope+obj.y+obj.h/2;
if (tempY>=obs[i].y &&
tempY<=obs[i].y+obs[i].h &&
(obj.x+obj.w/2<obs[i].x+obs[i].w &&
obs[i].x+obs[i].w<target.x+target.w/2 ||
obj.x+obj.w/2>obs[i].x+obs[i].w && 
obs[i].x+obs[i].w>target.x+target.w/2)
){return false;x=obs[i].x+obs[i].w;y=tempY;}}
return true;
}


