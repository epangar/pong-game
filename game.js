let canvas;
let canvasContext;

//Ball
let ballX = 50;
let ballY = 10;
let ballSpeedX = 10*2;
let ballSpeedY = 4*2;

//Paddles
let paddle1Y = 250;
let paddle2Y = 250;
const PADDLE_HEIGHT = 100;
const PADDLE_WIDTH = 10;

//Scores

let player1Score = 0;
let player2Score = 0;
const WINNING_SCORE = 3;

//Somebody won
let showingWinScreen = false;


window.onload = () =>{
    canvas = document.getElementById('canvasGame')
    canvasContext = canvasContext = canvas.getContext('2d');

    const framesPerSecond = 30;
    setInterval(() => {
        moveEverything();
        drawEverything();
    }, 1000/framesPerSecond);

    //Clicking the mouse
    canvas.addEventListener('mousedown', handleMouseClick);

    //Move left paddle with mouse
    canvas.addEventListener('mousemove', (e) =>{
        const mousePos = calculateMousePosition(e);
        paddle1Y = mousePos.y - (PADDLE_HEIGHT/2);
    })
}

//Move ball
const moveEverything = () => {
    if(showingWinScreen){
        return ;
    }
    computerMovement();
    //Move the ball horizontally
    ballX += ballSpeedX;
    //Move the ball vertically
    ballY -= ballSpeedY;
    
    //Ball direction when bouncing to the right
    if(ballX < 0){
        //The ball is below the top of the paddle and 
        //above the bottom of the paddle
        if(ballY > paddle1Y && ballY < paddle1Y + PADDLE_HEIGHT){
            //The ball bounces against the paddle
            ballSpeedX = -ballSpeedX;
            let deltaY = ballY - (paddle1Y + (PADDLE_HEIGHT/2));
            ballSpeedY = deltaY * 0.35;
        } else {
            //Reset the ball
            player2Score++; //must be BEFORE ballReset()
            ballReset();
            
        }
    }

    //Ball direction when bouncing to the left
    if(ballX > canvas.width){
        //The ball is below the top of the paddle and 
        //above the bottom of the paddle
        if(ballY > paddle2Y && ballY < paddle2Y + PADDLE_HEIGHT){
            //The ball bounces against the paddle
            ballSpeedX = -ballSpeedX;
            let deltaY = ballY - (paddle2Y + (PADDLE_HEIGHT/2));
            ballSpeedY = deltaY * 0.35;
        } else {
            //Reset the ball
            player1Score++; //must be BEFORE ballReset()
            ballReset();
        }
    }

    //Ball direction when bouncing on the upper side
    if(ballY < 0) {
        ballSpeedY = -ballSpeedY;
	}
     //Ball direction when bouncing on the down side
	if(ballY > canvas.height) {
		ballSpeedY = -ballSpeedY;
	}

}

//Draw board, paddles and ball
const drawEverything = () => {
    //Board
    colorRect(0,0,canvas.width, canvas.height,'black');

    if(showingWinScreen){
        canvasContext.fillStyle = 'white';
        if(player1Score >= WINNING_SCORE){
            canvasContext.fillText('Left player won!', 350,200);
        } else if(player2Score >= WINNING_SCORE ){
            canvasContext.fillText('Right player won!', 350,200);
        }
        
        canvasContext.fillText('Click to continue', 350,500);
        return ;
    }

    //Draw a net
    drawNet();
    //Left player paddle
    colorRect(0,paddle1Y,PADDLE_WIDTH,100,'white');
    //Right player paddle (computer)
    colorRect(canvas.width-PADDLE_WIDTH,paddle2Y,PADDLE_WIDTH,100,'white');
    //Ball
    colorCircle(ballX, ballY, 10, 'white');
    //Scores
    canvasContext.fillText(player1Score, 100,100);
    canvasContext.fillText(player2Score, canvas.width-100,100);
}

//Draw the net
const drawNet = () =>{
    for(let i = 0; i < canvas.height; i+=40){
        colorRect((canvas.width/2-1),i,2,20,'white')
    }
}

//Create a rectangle
const colorRect = (leftX,topY,width,height,drawColor) => {
    canvasContext.fillStyle = drawColor;
    canvasContext.fillRect(leftX,topY,width,height);
}

//Create a circle
const colorCircle = (centerX, centerY, radius, drawColor) => {
    canvasContext.fillStyle = drawColor;
    canvasContext.beginPath();
    canvasContext.arc(centerX, centerY, radius, 0, Math.PI*2, true);
    canvasContext.fill();
}

const calculateMousePosition = ev =>{
    const rect = canvas.getBoundingClientRect();
    const root = document.documentElement;
    let mouseX = ev.clientX - rect.left - root.scrollLeft;
    let mouseY = ev.clientY - rect.top - root.scrollLeft;

    return {
        x: mouseX,
        y: mouseY
    };
}

const ballReset = () =>{

    if(player1Score >= WINNING_SCORE || player2Score >= WINNING_SCORE ){
        showingWinScreen = true;
    }
    //Change ball direction
    ballSpeedX = -ballSpeedX;
    //Set ball in the center of the screen
    ballX = canvas.width/2;
    ballY = canvas.height/2;
}

//Computer's paddle movement
const computerMovement = () => {
    const paddleCenter = paddle2Y + (PADDLE_HEIGHT/ 2);
    if(paddle2Y < ballY-35){
        paddle2Y += 16;
    } else if(paddle2Y >ballY+35){
        paddle2Y -= 16;
    }
}

//Handle mouse click
const handleMouseClick = e => {
    if(showingWinScreen){
        showingWinScreen = false;
        player1Score = 0;
        player2Score = 0;
    }
}