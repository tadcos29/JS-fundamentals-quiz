// import quizData from 'quiz-data.json';

function init() {
   
    /*

        const objQuizBank = {
        questions:["foo___","bar___", "ele___", "mise___"],
        options:[["bar1", "bar2", "bar", "bar3"],["foo1","foo2","foo","foo4"],["phant","phint","pheasant","phone"],["rai","rhin","ry","ryu"]],
        answers:["bar", "foo", "phant", "ry"]
    } */


    
    //the objQuizBank stores an array of questions and an array of corresponding answer sets (arrays in their own right).
    let startButtEl = document.getElementById('start-button');
    let questFieldEl = document.getElementById('question-field');
    let answerFieldEl = document.getElementById('answer-field');
    let initFieldEl = document.getElementById('initials-field');
    let timerFieldEl = document.getElementById('timer-field');
    let hsButtEl= document.getElementById('HS-button');

    let bTimerActive=false;
    let bGameState=false;
    let drawnQuestion=0;
    questFieldEl.innerHTML="al";

    startButtEl.addEventListener("click", InitGame);
    hsButtEl.addEventListener("click", ShowHS);

    const TIME_VALUE = 60;
    const ERROR_PENALTY = 15;



    function InitGame() {

        if (!bGameState) { // Behaviour when Start button is clicked but there isn't a game on.
        bGameState=true;
        bTimerActive=true;
        // bBoardSet=false; ?
        this.innerHTML='RESET';
        let timeLeft=TIME_VALUE; // Standard timer.
        drawnQuestion=0;
        let limitReached=false;
        let timerInterval=setInterval(AdvanceTime, 1000);
       // drawnQuestion=QuestionRandomiser(); May put this in.
       console.log(objQuizBank.questions[drawnQuestion]);
        CreateBoard(drawnQuestion);


        function AdvanceTime() {
            if (bTimerActive) {
                timeLeft--;
                timerFieldEl.innerHTML=timeLeft;
            }
            
            if (timeLeft<=0 || limitReached || !bGameState) {
                clearInterval(timerInterval);
                if (timeLeft<=0) {answerFieldEl.innerHTML="Time is up.";}
                 else if (!bGameState) {answerFieldEl.innerHTML="Game over."} 
                 else if(limitReached) {answerFieldEl.innerHTML="Well done. Your score is "+timeLeft;}
                 bGameState=false;
                 startButtEl.innerHTML='START';

                 this.innerHTML='START';
                 timeLeft=0;
                 console.log(questFieldEl.children[0]);
                 timerFieldEl.innerHTML="";
                 BoardCleanUp();
            }

            
        }
        

        function CreateBoard(questionNumber) { 
                // Dynamically create the question, give options, and add listeners
                // to the options.
                questFieldEl.innerHTML=objQuizBank.questions[questionNumber];
                console.log("reached just into createboard with "+questionNumber);
                let questionHeader = document.createElement("ol");
                let optionItem=[];
                // Does this keep creating new arrays? Or do the arrays get cleaned up?
                let rgLocalShuffled=objQuizBank.options[questionNumber]; //reassigning the object array to a local one for shuffling.
                console.log("reached next createboard with "+questionNumber);
                shuffleArray(rgLocalShuffled); //shuffling the options, to randomise their order every time they are presented.
                questFieldEl.appendChild(questionHeader);
                // questionHeader.innerHTML=objQuizBank.questions[questionNumber]; I don't believe we need to put anything in the OL.
                // However, this may lead to odd behaviour if the innerHTML is treated like a child[0]. Unlikely, though.
                for (x=0;x<objQuizBank.options[questionNumber].length;x++) {
                    optionItem[x]=document.createElement("li");
                    questionHeader.appendChild(optionItem[x]);
                    optionItem[x].innerHTML=objQuizBank.options[questionNumber][x];
                    optionItem[x].id="option"+x;
                    optionItem[x].addEventListener("click", PrAns);
                }
            
                
               function PrAns () { // List item click handler.
                console.log("clicked on "+this.value);
                console.log("this is "+this);
                if (objQuizBank.answers[questionNumber]===this.innerHTML) {
                answerFieldEl.innerHTML="Right!"
                } else {
                answerFieldEl.innerHTML="Wrong!"
                timeLeft=timeLeft-ERROR_PENALTY;    
                }
                // clean up elements

                BoardCleanUp();

                if (drawnQuestion < (objQuizBank.answers.length-1)) {
                    drawnQuestion++;
                    console.log("reached dQ increment "+drawnQuestion);
                    CreateBoard(drawnQuestion);
                    } else {
                    limitReached=true;
                    }
                

                }   //end PrAns();
            
         return
            //CreateBoard scope ends here.
        }
    } else {bGameState=false;}//bGameState flag wrapper, just to avoid problems with multiple hits of the Start button.
    
    function BoardCleanUp() {
        console.log("Cleanup's Children: "+questFieldEl.children[0])
        if (questFieldEl.children[0]!=undefined) { // Under some conditions, such as clean victory, BoardCleanUp() has already been called,
                                                 // and questFieldEl is already childless. This catches the console error.
        for (i=0;i<questFieldEl.children[0].childElementCount;i++) { 
            console.log(questFieldEl.children[0].children[i]);//cleaning up any dynamic contents of question field once game is over.
            questFieldEl.children[0].children[i].removeEventListener;
            questFieldEl.children[0].removeChild(questFieldEl.children[0].children[i]);
        }  //Silence any extant event listeners on the grandchildren of the question field before destroying said grandchildren.
        questFieldEl.removeChild(questFieldEl.children[0]); //Destroy the sole child <ul> of the question field;
        }
        questFieldEl.innerHTML="";
    }


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
    function shuffleArray(array) {  // Durstenfeld shuffle, courtesy of a StackExchange answer.
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
    }

}

init();