var playerColors = ["red","green"];
var playerChoice = [".","."];
var finalState = "Game";

var playerNames=["Computer","Computer"];
var currentPlayer;
fetch("/send_file")
  .then(response => response.json())
  .then(data => {
      console.log(data);
      var numOfPlayers = data.numOfPlayers;
      var Players = data.Players;
      for(var i=1;i<=playerNames.length;i++)
      {
          playerNames[i-1]=Players[i-1];
          document.querySelector(".PlayerName"+i).innerHTML=playerNames[i-1];
      }
});


function chooseRandomPlayer()
{
    var randomPlayer = Math.floor(Math.random()*2)+1;

    if(randomPlayer === 1)
    {
    var player1 = prompt("Player choose your character ?");
    var player2 = (player1==='O'?'X':'O');
    }
    else
    {
        var player2 = prompt("Player choose your character ?");
        var player1 = (player2 ==='O'?'X':'O'); 
    }

    playerChoice=[player1,player2];
    for(var i=1;i<=playerChoice.length;i++)
    {
        document.querySelector(".player"+i).innerHTML=playerNames[i-1]+" has chosen "+playerChoice[i-1];
    }
    return randomPlayer;
}


/* which player start the game first */
document.addEventListener("keydown",function(){
    currentPlayer = chooseRandomPlayer();
    document.querySelector("h1").innerHTML=playerNames[currentPlayer-1]+" make a move";
    if(playerNames[currentPlayer-1]==="Computer")
    {
        setTimeout(function(){
            var randomDiv = chooseRandomDiv();
            randomDiv.click();
        },3000); 
    }
});

function changeBackgroundColor(gameState)
{
    if(gameState === "win" || gameState === "draw")
    {
        document.querySelector("body").style.backgroundColor = "yellow";
    }
    else
        document.querySelector("body").style.backgroundColor = "grey";
}
function playAudio(fileName)
{
    var audio = new Audio("sounds/"+fileName+".mp3");
    audio.play();
}

function resetBoard()
{
    changeBackgroundColor("reset");
    finalState="Game";
    document.querySelector("h1").innerHTML = "Play the Game";
    var blocks=document.querySelectorAll(".square");
    for(var i=0;i<blocks.length;i++)
    {
        blocks[i].innerHTML = '';
        blocks[i].style.backgroundColor = "white";
    }
    
    for(var i=1;i<=playerNames.length;i++)
    {
        document.querySelector(".player"+i).innerHTML="";
    }

    setTimeout(function(){
        currentPlayer = chooseRandomPlayer();
        document.querySelector("h1").innerHTML=playerNames[currentPlayer-1]+" make a move";
    },1000);
}

function checkBlocks(blocks,choice)
{
    for(var i=0;i<blocks.length;i++)
    {
        if(blocks[i].innerHTML != choice)
            return false;
    }
    return true;
}

function checkIfWin(choice){
    for(var i=1;i<=3;i++)
    {
        var blocksInRow = document.querySelectorAll(".row"+i);
        if(checkBlocks(blocksInRow,choice))
            return true;
        var blocksInCol = document.querySelectorAll(".col"+i);
        if(checkBlocks(blocksInCol,choice))
            return true;
    }

    var blockInDiag1 =document.querySelectorAll(".diag1");
    if(checkBlocks(blockInDiag1,choice))
        return true;
    var blockInDiag2 =document.querySelectorAll(".diag2");
    if(checkBlocks(blockInDiag2,choice))
        return true;
    return false;
}

function isDraw()
{
    var blocks=document.querySelectorAll(".square");
    for(var i=0;i<blocks.length;i++)
    {
        if(blocks[i].innerHTML !== 'O' && blocks[i].innerHTML !== 'X')
            return false;
    }

    return true;
}

function updateScore(state)
{
    if(state === "win" || state=="draw")
    {
        var currentScore = document.querySelector(".WinsPlayer"+currentPlayer).textContent;
        currentScore = parseInt(currentScore,10);
        currentScore+=1;
        document.querySelector(".WinsPlayer"+currentPlayer).textContent=currentScore;
        if(state=="win")
            return;
    }
    var secondPlayer=1;
    if(currentPlayer === 1)
    {
        secondPlayer = 2;
    }
    var anotherScore = document.querySelector(".WinsPlayer"+secondPlayer).textContent;
    anotherScore=parseInt(anotherScore,10);
    anotherScore+=1;
    document.querySelector(".WinsPlayer"+secondPlayer).textContent=anotherScore;
}

/* checks if the player clicked on already clicked block */
function IsWrongSquare(squareBlock)
{
    if(squareBlock.innerHTML === "")
        return false;
    return true;
}

var boardSquares = document.querySelectorAll(".square");

function chooseRandomDiv()
{
    var alreadyTried=[];
    while(true)
    {
        var randomRow = Math.floor(Math.random()*3)+1;
        if(alreadyTried.indexOf(randomRow) === -1)
        {
            var rowElements = document.querySelectorAll(".row"+randomRow);
            for(var i=0;i<rowElements.length;i++)
            {
                if(rowElements[i].innerHTML === "")
                    return rowElements[i];
            }
        }
        alreadyTried.push(randomRow);
    }
}



for(var i=0;i<boardSquares.length;i++)
{
    boardSquares[i].addEventListener("click",function(){
        if(!IsWrongSquare(this)){
            this.style.backgroundColor = playerColors[currentPlayer-1];
            this.innerHTML = playerChoice[currentPlayer-1];
            playAudio(playerColors[currentPlayer-1]);
            $(this).fadeOut(50).fadeIn(50);
            if(checkIfWin(this.innerHTML))
            {
                document.querySelector("h1").innerHTML=playerNames[currentPlayer-1]+" Wins!";
                changeBackgroundColor("win");
                playAudio("win");
                finalState="win";
                updateScore("win");

                setTimeout(function(){
                    resetBoard();
                },2000);
            }
            else
            {
                if(isDraw())
                {
                    document.querySelector("h1").innerHTML=" It's Draw";
                    playAudio("draw");
                    changeBackgroundColor("draw");
                    finalState="draw";
                    updateScore("draw");
                    setTimeout(function(){
                        resetBoard();
                    },2000);
                }
                else{
                    if(currentPlayer===1)
                        currentPlayer=2;
                    else
                        currentPlayer=1;
                        document.querySelector("h1").innerHTML=playerNames[currentPlayer-1]+" make a move";
                    if(playerNames[currentPlayer-1]==="Computer")
                    {
                        setTimeout(function(){
                            var randomDiv = chooseRandomDiv();
                            randomDiv.click();
                        },3000);  
                    }
                }
            }
        }
        else
        {
            alert(playerNames[currentPlayer-1]+" Invalid Move try again!");
        }
    });
}