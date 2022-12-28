// Set up the canvas and set its dimensions
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.style.position = 'fixed';
document.body.appendChild(canvas);

class ball{
    constructor(x,y,vx,vy,radius,mass,initVX,initVY){
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.radius = radius;
        this.mass = mass;
        this.initVX = initVX;
        this.initVY = initVY;
    }
}

ball1 = new ball(canvas.width/2,canvas.height/2,2,100,10,3,0,0)
const initx = canvas.width/2;
const inity = canvas.height/2
const acceleration = -10;
var dt = 0;
var Released = false;
let angle = 0;
const SpringConst = 0.7;
let Force = 0;

async function Setup(x1,y1,x2,y2) {
}
    

function DrawBall(ball) {
    ctx.beginPath();
    ctx.fillStyle = 'red';
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();

    if (!Released){
        ctx.beginPath();
        ctx.moveTo(canvas.width/2, canvas.height/2);
        ctx.lineTo(ball.x, ball.y);
        ctx.stroke();
    }
}

function GetVelocityY(ball,initialVelocity,time,theta){
    if (ball.y >= canvas.height){
        return 0
    }
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
            console.debug('hello')
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
    let VectorY = y-inity
    let VectorX = x-initx
    let NewVector = [VectorX,VectorY]
    const NormalVector = [1,0]
    let Length = Math.sqrt(Math.pow(NewVector[0],2)+Math.pow(NewVector[1],2))
    angle = Math.acos((NewVector[0])/Length)
    Force = SpringConst*Length
    VelocityXY = Math.sqrt(2*Force/ball.mass)
    ball.initVX = VelocityXY*Math.cos(angle);
    ball.initVY = VelocityXY*Math.sin(angle);
    console.debug(angle)
    if (angle < Math.PI/2){
        ball.initVX *= -1;
    }
    if (VectorY < 0){
        ball.initVY *= -1;
    }

}

function UnfollowBall(e) {
    Released = true;
    CalculateVector(ball1,e.clientX,e.clientY)
    window.removeEventListener("click",Clicked,false)
    window.removeEventListener("mousemove",FollowBall,false)
    window.removeEventListener("mouseup",UnfollowBall,false)
}

function FollowBall(e) {
    ball1.x = e.clientX;
    ball1.y = e.clientY;
    window.addEventListener("mouseup",UnfollowBall)
}

function GameLoop() {
    ctx.beginPath();
    ctx.rect(0, 0, window.innerWidth, window.innerHeight);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.closePath();
    DrawBall(ball1);
    UpdateBall(ball1,Released);
    if (Released === false){
        window.addEventListener("click", Clicked)
    }
    requestAnimationFrame(GameLoop);
}

Setup(0,0,100,100)
GameLoop()