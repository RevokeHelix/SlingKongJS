// Set up the canvas and set its dimensions
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.style.position = 'fixed';
document.body.appendChild(canvas);

class ball{
    constructor(x,y,vx,vy,radius){
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.radius = radius;
    }
}

ball1 = new ball(canvas.width/2,canvas.height/2,2,100,10)
const acceleration = -10;
var dt = 0;

function DrawBall(ball) {
    ctx.beginPath();
    ctx.fillStyle = 'red';
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
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
    if (launched === true){
        if (ball.x - canvas.width > 0){
            ball1.vx = -ball.vx
        }
        if (ball.x < 0){
            ball.vx = -ball.vx
        }
        if (ball.y < 0){
            ball.vy *= -1;
        }
        if (ball.y > canvas.height){
            ball.y = canvas.height;
            ball.vy = 0;
            ball.vx = 0;
        }
        ball.vy = GetVelocityY(ball,2,dt,-0.7*Math.PI);
        ball.vx = GetVelocityX(ball,1,-0.7*Math.PI)

        ball.x += ball.vx;
        ball.y -= ball.vy;
        dt += 0.01
        console.debug(ball.vx,ball.y)
    }
}

function followMouse(ball) {
    console.debug('hi')
  
    // Set the ball's position to the mouse's position
  }
  
  function stopFollowingMouse() {
    // Remove the event listener that causes the ball to follow the mouse
    canvas.removeEventListener("mousemove", followMouse);
  }

function GameLoop() {
    ctx.beginPath();
    ctx.rect(0, 0, window.innerWidth, window.innerHeight);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.closePath();
    DrawBall(ball1);
    UpdateBall(ball1,false);
    window.addEventListener("click", function(event) {
        // Check if the click occurred inside the ball
        const clickX = event.clientX;
        const clickY = event.clientY;
        const isInside =
          clickX > ball1.x - ball1.radius &&
          clickX < ball1.x + ball1.radius &&
          clickY > ball1.y - ball1.radius &&
          clickY < ball1.y + ball1.radius;
      
        if (isInside) {
          ball1.x = clickX;
          ball1.y = clickY;
        }
      });
}

setInterval(GameLoop,1)