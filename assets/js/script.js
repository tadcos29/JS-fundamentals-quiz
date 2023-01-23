

function init() {
    
    const objQuizBank = {
        questions:["foo___","bar___"],
        options:[["bar1", "bar2", "bar", "bar3"],["foo1","foo2","foo","foo4"]],
        answers:["bar", "foo"]
    }
    //the objQuizBank stores an array of questions and an array of corresponding answer sets (arrays in their own right).
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
        if (!bGameState) {
        bGameState=true;
        bTimerActive=true;
        bBoardSet=false;
        let timeLeft=60;
        questFieldEl.innerHTML=objQuizBank.answers[1];
        let timerInterval=setInterval(AdvanceTime, 1000);
        CreateBoard(1);


        function AdvanceTime() {
            if (bTimerActive) {
                timeLeft--;
            }
            timerFieldEl.innerHTML=timeLeft;
            if (timeLeft<=0) {clearInterval(timerInterval);answerFieldEl.innerHTML="Time is up."; bGameState=false;}
            
        }
        

        function CreateBoard(questionNumber) { 
                // Dynamically create the question, give them answers, and add listeners
                // to the answers.
                let questionHeader = document.createElement("ol");
                let optionItem=[];
                // Does this keep creating new arrays? Or do the arrays get cleaned up?
                let cleanUpBoard=false;
                let rgLocalShuffled=objQuizBank.options[questionNumber]; //reassigning the object array to a local one for shuffling.
                shuffleArray(rgLocalShuffled); //shuffling the options, to randomise their order every time they are presented.
                questFieldEl.appendChild(questionHeader);
                questionHeader.innerHTML=objQuizBank.questions[questionNumber];
                for (x=0;x<objQuizBank.options[questionNumber].length;x++) {
                    optionItem[x]=document.createElement("li");
                    questionHeader.appendChild(optionItem[x]);
                    optionItem[x].innerHTML=objQuizBank.options[questionNumber][x];
                    optionItem[x].id="option"+x;
                    optionItem[x].addEventListener("click", PrAns);
                }
            
                
               
                function shuffleArray(array) {  // Durstenfeld shuffle, courtesy of a StackExchange answer.
                    for (var i = array.length - 1; i > 0; i--) {
                        var j = Math.floor(Math.random() * (i + 1));
                        var temp = array[i];
                        array[i] = array[j];
                        array[j] = temp;
                    }
                }
                
               function PrAns () {
                console.log("clicked on "+this.value);
                console.log("this is "+this);
                if (objQuizBank.answers[questionNumber]===this.innerHTML) {
                answerFieldEl.innerHTML="Right!"
                } else {
                answerFieldEl.innerHTML="Wrong!"
                timeLeft=timeLeft-10;    
                }
                // clean up elements

                for (x=0;x<optionItem.length;x++) {
                    optionItem[x].removeEventListener;
                    questionHeader.removeChild(optionItem[x]);
                }
                questFieldEl.removeChild(questionHeader);
               }
                function ProcessAnswer(questionAsked, optionSelected) {
                    console.log("clicked on "+this.id);
                    console.log(this);
                    console.log(questionAsked, optionSelected);
                   // console.log(objQuizBank.options[questionAsked][optionSelected]);
                    if (objQuizBank.options[questionAsked][optionSelected]===objQuizBank.answers[questionAsked]){
                        // they got it right
                        answerFieldEl.innerHTML="Right!"
                        cleanUpBoard=true;
                    } else  {
                        answerFieldEl.innerHTML="Wrong!"
                        timeLeft=timeLeft-10;
                    }
                    
                        return
                    
                } //ProcessAnswer
                // make sure to get rid of these dynamically generated event listeners!

            return
            //CreateBoard scope ends here.
        }
    } //bGameState flag wrapper, just to avoid problems with multiple hits of the Start button.
    
    return // InitGame scope ends here.
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