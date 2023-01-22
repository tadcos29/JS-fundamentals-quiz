

function init() {
    
    const objQuizBank = {
        questions:["foo___","bar___"],
        answers:["bar","foo"]
    }
    let startButtEl = document.getElementById('start-button');
    let questFieldEl = document.getElementById('question-field');
    let answerFieldEl = document.getElementById('answer-field');
    let initFieldEl = document.getElementById('initials-field');
    let timerFieldEl = document.getElementById('timer-field');
    let hsButtEl= document.getElementById('HS-button');

    let bTimerActive=false;
    let bGameState=false;
    questFieldEl.innerHTML="al";

    startButtEl.addEventListener("click", InitGame);
    hsButtEl.addEventListener("click", ShowHS);

    function InitGame() {
        bGameState=true;
        bTimerActive=true;
        let timeLeft=60;
        questFieldEl.innerHTML=objQuizBank.answers[1];
        let timerInterval=setInterval(AdvanceTime, 1000);



        function AdvanceTime() {
            if (bTimerActive) {
                timeLeft--;
            }
            timerFieldEl.innerHTML=timeLeft;
            if (timeLeft<=0) {clearInterval(timerInterval);answerFieldEl.innerHTML="Time is up."; gameState=false;}
            
        }
        

    }

    function ShowHS() {
        console.log("reached showhs")
        if (bGameState){
            if (bTimerActive) {bTimerActive=false;initFieldEl.innerHTML="Showing this, pausing timer."} 
            else { bTimerActive=true;initFieldEl.innerHTML="Game back on."}
        } else {initFieldEl.innerHTML="Showing this, game is not on."}
        return

    }

}

init();