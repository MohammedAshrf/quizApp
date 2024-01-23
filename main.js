//* Task:
// Clean the code.

// Select Elements
let countSpan = document.querySelector(".count span"),
  bullets = document.querySelector(".bullets"),
  bulletsSpanContainer = document.querySelector(".bullets .questions-number"),
  quizArea = document.querySelector(".quiz-area"),
  answersArea = document.querySelector(".answers-area"),
  submitButton = document.querySelector(".submit-button"),
  resultsContainer = document.querySelector(".results"),
  countdownElement = document.querySelector(".bullets .countdown");

// Set Options
let currentIndex = 0,
  rightAnswers = 0,
  countdownInterval;

function getQuestions() {
  let myRequest = new XMLHttpRequest();

  myRequest.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let questionsObject = JSON.parse(this.responseText),
        qCount = questionsObject.length;

      // Create Bullets + Set Questions Count
      createBullets(qCount);

      // Add Question Data
      addQuestionData(questionsObject[currentIndex], qCount);

      // Start countDown
      countdown(3, qCount);

      // Click On Submit
      submitButton.onclick = () => {
        // Get Right Answer
        let theRightAnswer = questionsObject[currentIndex].right_answer;

        // Increase Index
        currentIndex++;

        // Check The Answer
        checkAnswer(theRightAnswer, qCount);

        // Remove Previous Question
        quizArea.innerHTML = "";
        answersArea.innerHTML = "";

        // Add Question Data
        addQuestionData(questionsObject[currentIndex], qCount);

        // Handle Bullets Class
        handleBullets();

        // Start countDown
        clearInterval(countdownInterval);
        countdown(3, qCount);

        // Show Results
        showResults(qCount);
      };
    }
  };

  myRequest.open("GET", "html_questions.json", true);
  myRequest.send();
}

getQuestions();

function createBullets(num) {
  countSpan.innerHTML = num;
  // Create questions-number
  for (let i = 0; i < num; i++) {
    // Create Bullet
    let theBullet = document.createElement("span");
    // Check If Its First Span
    if (i === 0) {
      theBullet.className = "on";
    }
    // Append Bullets To Main Bullet Container
    bulletsSpanContainer.appendChild(theBullet);
  }
}

function addQuestionData(obj, count) {
  if (currentIndex < count) {
    // Create H2 Question Title
    let questionTitle = document.createElement("h2"),
      // Create Question Text
      questionText = document.createTextNode(obj["title"]);

    // Append Text To H2
    questionTitle.appendChild(questionText);
    // Append The H2 To The Quiz Area
    quizArea.appendChild(questionTitle);

    // Create The Answers
    for (let i = 1; i <= 4; i++) {
      // Create Main Answer Div
      let mainDiv = document.createElement("div");

      // Add Class To Main Div
      mainDiv.className = "answer";

      // Create Radio Input
      let radioInput = document.createElement("input");

      // Add Type + Name + Id + Data-Attribute
      radioInput.name = "question";
      radioInput.type = "radio";
      radioInput.id = `answer_${i}`;
      radioInput.dataset.answer = obj[`answer_${i}`];

      // Make First Option Selected
      if (i === 1) {
        radioInput.checked = true;
      }

      // Create Label
      let theLabel = document.createElement("label");

      // Add For Attribute
      theLabel.htmlFor = `answer_${i}`;

      // Create Label Text
      let theLabelText = document.createTextNode(obj[`answer_${i}`]);

      // Add The Text To Label
      theLabel.appendChild(theLabelText);
      // Add Input + Label To Main Div
      mainDiv.appendChild(radioInput);
      mainDiv.appendChild(theLabel);
      // Append All Divs To Answers Area
      answersArea.appendChild(mainDiv);
    }
  }
}

function checkAnswer(rAnswer) {
  let answers = document.getElementsByName("question");
  let theChoosenAnswer;

  for (let i = 0; i < answers.length; i++) {
    if (answers[i].checked) {
      theChoosenAnswer = answers[i].dataset.answer;
    }
  }

  if (rAnswer === theChoosenAnswer) {
    rightAnswers++;
  }
}

function handleBullets() {
  let bulletsSpans = document.querySelectorAll(
    ".bullets .questions-number span"
  );
  let arrayOfSpans = Array.from(bulletsSpans);
  arrayOfSpans.forEach((span, index) => {
    if (currentIndex === index) {
      span.className = "on";
    }
  });
}

function showResults(count) {
  let theResults;
  if (currentIndex === count) {
    // console.log("finished");
    quizArea.remove();
    answersArea.remove();
    submitButton.remove();
    bullets.remove();

    if (rightAnswers > count / 2 && rightAnswers < count) {
      theResults = `<span class='good'>Good job</span> ${rightAnswers} from ${count}`;
    } else if (rightAnswers > count) {
      theResults = `<span class='perfect'>Well done</span>you All made it all right`;
    } else {
      theResults = `<span class='bad'>Nice try</span> ${rightAnswers} from ${count}`;
    }
    resultsContainer.innerHTML = theResults;
    // resultsContainer.style.padding = "10px";
    // resultsContainer.style.backgroundColor = "white";
    // resultsContainer.style.marginTop = "5px";
  }
}
function countdown(duration, count) {
  if (currentIndex < count) {
    let minutes, seconds;
    countdownInterval = setInterval(function () {
      minutes = parseInt(duration / 60);
      seconds = parseInt(duration % 60);

      minutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
      seconds = seconds < 10 ? `0${seconds}` : `${seconds}`;

      countdownElement.innerHTML = `${minutes}:${seconds}`;

      if (--duration < 0) {
        clearInterval(countdownInterval);
        submitButton.click();
        console.log("finished");
      }
    }, 1000);
  }
}
