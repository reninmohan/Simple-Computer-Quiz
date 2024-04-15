const questionTxt = document.getElementById("questionTxt");
const answers = document.getElementById("answers");
const nextBtn = document.getElementById("nextBtn");
const buttons = document.getElementsByClassName("btn");

let answerOption;
let score = 0;
let currentQuestion = 0;
let questionSet; 

// Fetching Data from quetion api and initiliaize questionBank. 
startQuiz();

async function fetchData() {
    const apiUrl = "https://opentdb.com/api.php?amount=10&category=18&difficulty=easy&type=multiple";
    // const apiUrl = "http://localhost:3000/quiz"
    try {
        let response = await fetch(apiUrl);
        let data = await response.json();
        if(data.results){
            return  data.results;
        }else{
            throw new Error("Unable to fetch Data")
        }
    } catch(error) {
        console.error("Error has occurred", error);
    }
}

async function startQuiz(){
    questionSet = await fetchData(); 
    DisplayQuestion(currentQuestion); 
}


//displaying question and answers
function DisplayQuestion(){
        questionTxt.innerText =`${currentQuestion+1}. ${questionSet[currentQuestion].question}`;
        //First clearing all child elements of answers div then, set option text for each button with class btn
        answers.innerHTML = "";
        const {correct_answer, incorrect_answers} = questionSet[currentQuestion]
        let tempArray = [correct_answer,...incorrect_answers];
        answerOption = tempArray.sort(()=>Math.random() - 0.5);
        answerOption.forEach((element)=>{
            let button = document.createElement("button");
            button.classList.add("btn");
            button.innerText = element;
            answers.appendChild(button);
            button.addEventListener('click', handleAnswer);
        });
    }



function replay(){
    score = 0;
    currentQuestion = 0;
    startQuiz();
    nextBtn.innerText = "Next";
}


function nextQuestion(){
    currentQuestion++;
    if(currentQuestion < questionSet.length){
        DisplayQuestion();
    }else{
        questionTxt.innerHTML = `You scored ${score} out of ${questionSet.length}`
        answers.innerHTML = "";
        nextBtn.innerText = "Play Again";
        nextBtn.addEventListener("click", replay);
    }
}


function handleAnswer(event){
    let selectButton = event.target;
    if(selectButton.innerText === questionSet[currentQuestion].correct_answer){
        score++;
        selectButton.classList.add("correct");
    }else{
        selectButton.classList.add("wrong")
        
    }

    for(let i=0;i<buttons.length;i++){
        buttons[i].disabled = true;
        if(buttons[i].innerText === questionSet[currentQuestion].correct_answer){
            buttons[i].classList.add("correct");
        }
    }
    
}

//Event handler for Next Button
nextBtn.addEventListener('click', nextQuestion);