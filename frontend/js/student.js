let url = "https://us-central1-forschool-5a2a8.cloudfunctions.net/app";
let arrData = [];
//Get localstorage
function loadData(){
    readDatabase(url);
}

function readDatabase(url){
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let data = JSON.parse(this.responseText);
            if(data != null){
                arrData = [...data];
                loadTextArea();
            }
        }
    };
    xhttp.open("GET", url, true);
    xhttp.send();
 
} 

loadData();

function loadTextArea(){
    let main = document.getElementById("quizContent");
    for(let count = 0; count < arrData.length; count++){
        let container = document.createElement("section");
        container.className = "container-quizbox";
        container.classList.add("margin-left");
        container.innerHTML =`   
            <h2>Question ${count+1} </h2>
            <h5>ID: ${arrData[count].qid}</h5>
            <textarea name="" cols="120" rows="8" disabled>${arrData[count].answers.question}</textarea>
        `;

        let answerDiv;
        let choices = arrData[count].answers.choices;
        let i = 0;
        for (const choice of choices) {
            // only add a choice if it is not blank
            if (choice != "") {
                //get a character as a function of i: 0 = A, 1 = B, etc.
                char = String.fromCharCode(i + 65);

                answerDiv = document.createElement("div");
                answerDiv.classList.add("question");
                answerDiv.innerHTML = `
                    <input type="radio" name="quiz${count+1}" value="${char}">
                    <input type="text" value="${arrData[count].answers.choices[i]}" disabled>  
                `;
            }
            container.appendChild(answerDiv);
            i++;
        }

        main.appendChild(container);
    }
}

//Calcuate answwers
function calcAnswers(){
    let score = 0;
    if(arrData.length > 0){
        let chosenAnswers = getChosenAnswers();

        for(let x = 0; x < chosenAnswers.length ; x++){
            if(chosenAnswers[x] == arrData[x].answers.answer){
                score++;
            }
        }
    }
    else{
        answer.innerHTML = "There are no questions to submit";
    }


    modal.style.display = "block";
    // Remove plural 's' when there is only one score or one question
    let a = 's', b = 's';
    if (score == 1) {
        a = '';
    }
    if (arrData.length == 1) {
        b = '';
    }
    let percentage = (score / arrData.length) * 100;
    document.getElementById('modalText').innerHTML = `You got <b>${score}</b> correct answer${a} out of <b>${arrData.length}</b> question${b}.\nPercentage: ${percentage.toFixed(1)}%`;
    // If score is 100%, then add gif
    if (percentage == 100) {
        let img = document.createElement('img');
        img.setAttribute('src', 'img/celebration.gif');
        document.getElementById('modalText').appendChild(img);
    }
}

function getChosenAnswers(){
    let answersPicked = [];
    let count = 0;
    let questionsDOMArr = document.getElementsByClassName("container-quizbox");
    //Loop through container
    for (const iterator of questionsDOMArr) {
        count = 0;
        //Don't need the Question number so filter it out //case sensitive
        let textData = Array
            .from(iterator.children)
            .filter(node=>check = node.nodeName!= "H2" |node.nodeName!= "TEXTAREA");

        textData.forEach(node=>{
            if(node.nodeName == "DIV" && node.className =="question"){
                //radio button
                if(node.children[0].checked == true){
                    answersPicked.push(node.children[0].value);
                }
                else{
                    //If count == 4 no answer was choosen
                    count++;
                }
                if(count == 4){
                    answersPicked.push("");
                }
                
            }
        });
    }
    return answersPicked;
}

// Modal functions
let modal = document.getElementById("myModal");
let btn = document.getElementById("submitButton");
let span = document.getElementsByClassName("close")[0];

span.onclick = function() {
    modal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}