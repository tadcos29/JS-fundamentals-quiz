

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
    questFieldEl.innerHTML="al";

    startButtEl.addEventListener("click", InitGame);


    function InitGame() {
        let nTimerActive=true;
        let timeLeft=60;
        questFieldEl.innerHTML=objQuizBank.answers[1];
        let timerInterval=setInterval(AdvanceTime, 1000);



        function AdvanceTime() {
            if (nTimerActive) {
                timeLeft--;
            }
            timerFieldEl.innerHTML=timeLeft;
            if (timeLeft<=0) {clearInterval(timerInterval);}
        }

    }

   

}

init();