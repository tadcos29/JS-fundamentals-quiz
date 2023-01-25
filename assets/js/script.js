

function init() {
   
    /*

       Please note that the quiz-data.js file, which is loaded before this one, contains the objQuizBank 
       object, which stores an array of questions in the 'questions' property, and two additional arrays
       in the 'options' and 'answers' properties. The first of these additional arrays stores arrays of 
       false choices to create multiple choice questions. The second stores the correct answers.

       This was done simply for convenience and aesthetics, to more easily expand the question pool.
    
    */

    
    // Get ids of elements relevant to gameplay.
    let startButtEl = document.getElementById('start-button');
    let questFieldEl = document.getElementById('question-field');
    let answerFieldEl = document.getElementById('answer-field');
    let initFieldEl = document.getElementById('initials-field');
    let timerFieldEl = document.getElementById('timer-field');
    let hsButtEl= document.getElementById('HS-button');
    let hsdButtEl= document.getElementById('HSD-button');
    let hsListFieldEl= document.getElementById('HS-list');
    let gameBoardEl=document.getElementById('game-board');
    let submitButtEl=document.getElementById('submit-button');


    //Get existing high scores, if any.
    let objHighScores = RetrieveHS();
    
    
    // Initialise game state and timer variables, clear fields.
    let bTimerActive=false;
    let bGameState=false;
    let drawnQuestion=0;
    let defaultInitials="TGC";
    questFieldEl.innerHTML="";
    
    //Add event listeners to the START and HIGH SCORES buttons.
    startButtEl.addEventListener("click", InitGame);
    hsButtEl.addEventListener("click", ShowHS);
    submitButtEl.addEventListener("click",GetInitials);
    hsdButtEl.addEventListener("click",DeleteHS);

    //Constants to easily tweak game difficulty and balance.
    const TIME_VALUE = 60;
    const ERROR_PENALTY = 15;
    let scoreTime=0;


    // The START button doubles as the forfeit button, should the user wish to exit early. 
    function InitGame() {

        if (!bGameState) { // Game starts when START button is clicked but there isn't a game on.
        bGameState=true;
        bTimerActive=true;
        answerFieldEl.innerHTML="";
        // bBoardSet=false; ?
        this.innerHTML='RESET';
        timeLeft=TIME_VALUE; // Standard timer.
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
                if (timeLeft<11 && timeLeft>0) {
                    timerFieldEl.style.color="red";
                } else {timerFieldEl.style.color="";}

            }
            
            if (timeLeft<=0 || limitReached || !bGameState) {
                clearInterval(timerInterval);
                if (timeLeft<=0) {answerFieldEl.innerHTML= "Time has run out for you. You are not eligible for a high score.";}
                 else if (!bGameState) {answerFieldEl.innerHTML="Forfeit. Your self-awareness does you credit. Game over.";timeLeft=0;} 
                 else if(limitReached) {
                scoreTime=timeLeft;
                timeLeft=0;
                answerFieldEl.innerHTML="Well done for finishing. Your score is "+scoreTime+". Please input your initials (max 3 characters) so that your score may be recorded for posterity." 
                initFieldEl.style.display=""; // alternative
                submitButtEl.style.display="";
                hsButtEl.style.display="none";
                startButtEl.style.display="none";
                 //objHighScores.push([defaultInitials,timeLeft]);
                // WriteHS(objHighScores);
                        //Is it conceivably reloading the page and re-reading the existing thing? But then it would duplicate first.
                }
                 bGameState=false;
                 startButtEl.innerHTML='START';

                 this.innerHTML='START';
                 //timeLeft=0;
              
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
                    optionItem[x].addEventListener("click", ProcessAnswer);
                }
            
                
               function ProcessAnswer () { // List item click handler.
                console.log("clicked on "+this.value);
                console.log("this is "+this);
                if (objQuizBank.answers[questionNumber]===this.innerHTML) {
                answerFieldEl.innerHTML="Right!"
                } else {
                answerFieldEl.innerHTML="Wrong!"
                timeLeft=timeLeft-ERROR_PENALTY;    
                }

                // Clean up any remaining lists.
                BoardCleanUp();

                if (drawnQuestion < (objQuizBank.answers.length-1)) {
                    drawnQuestion++;
                    console.log("reached dQ increment "+drawnQuestion);
                    CreateBoard(drawnQuestion);
                    } else {
                    limitReached=true;
                    }
                

                }   //end ProcessAnswer();
            
         return
            //CreateBoard scope ends here.
        }
    } else {bGameState=false;}//bGameState flag wrapper, just to avoid problems with multiple hits of the Start button.
    
    function BoardCleanUp() {
        console.log("Cleanup's Children: "+questFieldEl.children[0])
        if (questFieldEl.children[0]!=undefined) { // Under some conditions, such as clean victory, BoardCleanUp() has already been called,
                                                 // and questFieldEl is already childless. This conditional catches the console error.
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
    function GetInitials() {
        event.preventDefault();
        if (initFieldEl.value=="") {alert("Please don't make this more difficult than it has to be. Input some initials.");} else {
            initFieldEl.style.display="none";
            submitButtEl.style.display="none";
            hsButtEl.style.display="";
            startButtEl.style.display="";
            defaultInitials=initFieldEl.value;
            console.log("for some reason time Left is "+timeLeft);
            console.log("for some reason defaultInitials is "+defaultInitials);
            objHighScores.push([defaultInitials,scoreTime]);
            WriteHS(objHighScores);
            answerFieldEl.innerHTML="Congratulations on finishing the quiz."
           
        }
    }
 
    function RetrieveHS() {
        let objTempHS={};
        objTempHS=JSON.parse(localStorage.getItem("tadcos29-js-quiz-hs"));
    // if (objTempHS) {return objTempHS;} else {return {names:[],scores:[]}}
    if (objTempHS) {console.log("purely for the sake of argument, objtemp is "+objTempHS);return objTempHS;} else {return []}
    }

    function WriteHS(objTempHS) {
        localStorage.setItem("tadcos29-js-quiz-hs", JSON.stringify(objTempHS));
    }

    function DeleteHS() {
        objHighScores.length=0;
        localStorage.setItem("tadcos29-js-quiz-hs", JSON.stringify(objHighScores));
        hsListFieldEl.innerHTML=DrawHSNicely();
    }
    function DrawHSNicely() {
        let formattedScores="";
        if (objHighScores.length>0) {
            formattedScores="<br>High scores:<br><br>"
        for (x=0;x<objHighScores.length;x++) {
            formattedScores=formattedScores+objHighScores[x][0]+" ---- "+objHighScores[x][1]+"<br>";
        }

        } else {formattedScores="There are no high scores recorded at this time."}

        return formattedScores;

    }
    function ShowHS() {
        console.log("reached showhs");
        if (bGameState){ // Processing the request to show high scores while the game is running.
            if (bTimerActive) {bTimerActive=false;
                gameBoardEl.style.display="none"; //Hide main game board container
                hsButtEl.innerHTML="BACK"; // The HIGH SCORES button becomes the back button.
                if (objHighScores.length>0) {
                hsdButtEl.style.display=""; //Display the button for deleting high scores.
                }
                hsListFieldEl.innerHTML=DrawHSNicely()+ "<br> Timer paused.";
                hsListFieldEl.style.display="";} //Show high score list container
            else { bTimerActive=true;
                gameBoardEl.style.display="";
                hsdButtEl.style.display="none";
                hsListFieldEl.style.display="none";
                hsButtEl.innerHTML="HIGH SCORES";}
        } else if (hsButtEl.innerHTML==="BACK") {  // return to main screen if high scores are currently being displayed
            hsButtEl.innerHTML="HIGH SCORES"; 
            hsdButtEl.style.display="none";
            gameBoardEl.style.display="";
            hsListFieldEl.style.display="none";
            }
          else { // show high scores if they are NOT currently being displayed
            hsListFieldEl.style.display=""; //Show high score list container
            hsListFieldEl.innerHTML=DrawHSNicely(); //There is no game.
             gameBoardEl.style.display="none"; //Hide main game board container
             if (objHighScores.length>0) {
                hsdButtEl.style.display=""; //Display the button for deleting high scores.
                }
             hsButtEl.innerHTML="BACK";} // Repurposing the HIGH SCORES button into the BACK button, as before.
        
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