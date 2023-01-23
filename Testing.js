// Set up the canvas and set its dimensions
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.style.position = 'fixed';
document.body.appendChild(canvas);

class ball{
    constructor(x,y,vx,vy,radius,mass,initVX,initVY,initx,inity){
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.radius = radius;
        this.mass = mass;
        this.initVX = initVX;
        this.initVY = initVY;
        this.initx = initx;
        this.inity = inity;
    }
}

class grip{
    constructor(x,y){
        this.x=x;
        this.y=y;
    }
    drawGrip(camera) {
        ctx.beginPath();
        ctx.fillStyle = 'blue';
        ctx.stroke();
        ctx.arc(this.x, this.y-camera.offsety, 20, 0, 2*Math.PI);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
      }
      isInRadius(x,y,ball) {
        if (Math.abs(this.x-x) < 40 && Math.abs(this.y-y) < 40){
            console.log('is in radius')
            ball.initx = x;
            ball.inity = y;
            ball.initVX = 5;
            ball.initVY = 5;
            Released = false;
        }
      }
}

class camera{
    constructor(offsety){
        this.offsety = offsety;
    }

    Update(ball){
        this.offsety = ball.y-canvas.height/2;
    }
}

let ball1 = new ball(canvas.width/2,canvas.height/2,2,100,10,3,0,0,canvas.width/2,canvas.height/2)
const acceleration = -10;
var dt = 0;
var Released = false;
let angle = 0;
const SpringConst = 1.5;
let Force = 0;
let grip1 = null;
let PlayerCamera = new camera(0)

async function Setup() {
    grip1 = new grip(400,400);
    grip1.drawGrip(PlayerCamera)
}
    

function DrawBall(ball,camera) {
    ctx.beginPath();
    ctx.fillStyle = 'red';
    ctx.arc(ball.x, ball.y-camera.offsety, ball.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();

    if (!Released){
        ctx.beginPath();
        ctx.moveTo(ball.initx, ball.inity);
        ctx.lineTo(ball.x, ball.y);
        ctx.stroke();
    }
}

function GetVelocityY(ball,initialVelocity,time,theta){
    if (ball.y >= canvas.height){
        return 0
    }
    console.debug(initialVelocity*Math.sin(theta)+acceleration*time)
    return Math.ceil(initialVelocity*Math.sin(theta)+acceleration*time)
}

function GetVelocityX(ball,initialVelocity,theta){
    if (ball.x >= canvas.width){
        return 0
    }
    return Math.floor(initialVelocity*Math.cos(theta))
}

function UpdateBall(ball,launched) {

    ball.vy = GetVelocityY(ball,ball.initVY,dt,angle);
    ball.vx = GetVelocityX(ball,ball.initVX,angle);

    if (launched === true){
        if (ball.x - canvas.width > 0){
            ball1.vx = -ball.vx
        }
        if (ball.x-100 < 0){
            ball.initvx *= 0
        }
        if (ball.y > canvas.height){
            ball.y = canvas.height;
            ball.vy = 0;
            ball.vx = 0;
        }


        ball.x += ball.vx;
        ball.y -= ball.vy;
        dt += 0.01
        
    }
}

function Clicked(e){
    const clickX = e.clientX;
    const clickY = e.clientY;
    const isInside =
    clickX > ball1.x - ball1.radius &&
    clickX < ball1.x + ball1.radius &&
    clickY > ball1.y - ball1.radius &&
    clickY < ball1.y + ball1.radius;

        if (isInside) {
        window.addEventListener("mousemove",FollowBall,false)
}
}

function CalculateVector(ball,x,y) {
    let VectorY = y-ball.inity
    let VectorX = x-ball.initx
    let NewVector = [VectorX,VectorY]
    console.log(NewVector)
    let Length = Math.sqrt(Math.pow(NewVector[0],2)+Math.pow(NewVector[1],2))
    angle = Math.acos((NewVector[0])/Length)
    Force = (SpringConst)*Length
    VelocityXY = Math.sqrt(2*Force/ball.mass)
    ball.initVX = VelocityXY*Math.cos(angle);
    ball.initVY = VelocityXY*Math.sin(angle);
    console.log(ball.initVX,ball.initVY)
    if (angle < Math.PI/2){
        ball.initVX *= -1;
    }
    if (VectorY < 0){
        ball.initVY *= -1;
    }

}

function UnfollowBall(e) {
    Released = true;
    CalculateVector(ball1,e.clientX,e.clientY);
    window.removeEventListener("click",Clicked,false);
    window.removeEventListener("mousemove",FollowBall,false);
    window.removeEventListener("mouseup",UnfollowBall,false);
}

function FollowBall(e) {
    ball1.x = e.clientX;
    ball1.y = e.clientY;
    window.addEventListener("mouseup",UnfollowBall)
}

function UpdateObjects(){
    if (Released === true){
        UpdateBall(ball1,Released);
        PlayerCamera.Update(ball1);
}
}

function GameLoop() {
    ctx.beginPath();
    ctx.rect(0, 0, window.innerWidth, window.innerHeight);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.closePath();
    DrawBall(ball1,PlayerCamera);
    grip1.drawGrip(PlayerCamera);
    UpdateObjects();
    grip1.isInRadius(ball1.x,ball1.y,ball1);
    if (Released === false){
        window.addEventListener("click", Clicked)
    }
    console.log(Released)
    requestAnimationFrame(GameLoop);
}

Setup()
GameLoop()