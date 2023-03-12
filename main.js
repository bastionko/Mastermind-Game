"use strict";
let tryGridBox = document.querySelector(".tryGrid");
let resultGridBox = document.querySelector(".resultGrid");
let symbolGridBox = document.querySelector(".symbolGrid");
let finalResultDiv = document.querySelector(".final-result");
let clickSound = new Audio("./sounds/click-1.wav");
let wrongSound = new Audio("./sounds/wrong.wav");
let backgroundMusic = document.getElementById("my_audio");
let newGameBtn = document.getElementById("new-game");
let footer = document.querySelector("footer");
let wrapper = document.querySelector(".wrapper");
let messageNotice = document.querySelector(".message");
let exitButtonAdd = `<button class="new-game-btn" id="exit-button">EXIT</button>`;
let stopMusicBtnAdd = `<button class="new-game-btn" id="stop-music-button">STOP MUSIC</button>`;
let playMusicBtnAdd = `<button class="new-game-btn" id="play-music-button">PLAY MUSIC</button>`;

let test = false;

wrapper.style.visibility = "hidden";
footer.style.visibility = "hidden";

newGameBtn.addEventListener("click", newGame);

function newGame() {
  wrapper.style.visibility = "visible";
  footer.style.visibility = "visible";
  console.log("starting new game...");

  let symbols = [
    "img/herc.png",
    "img/karo.png",
    "img/pik.png",
    "img/tref.png",
    "img/sova.png",
    "img/zvezda.png",
  ];
  let maxTry = 6;
  let combination = [];
  let myTry = [];
  let tryRow = [];
  let checkRow = [];
  let currentResult = [];
  let tryNumber = 0;

  startGame();
  renderButtons();

  function startGame() {
    messageNotice.innerHTML = "";
    backgroundMusic.currentTime = 0;
    window.addEventListener("click", () => {
      backgroundMusic.muted = false;
      if (!backgroundMusic) {
        backgroundMusic.play();
      }
    });
    renderBoard();
    symbolGridBox.innerHTML = "";
    renderSymbols();
    combination = [
      randomNumber(),
      randomNumber(),
      randomNumber(),
      randomNumber(),
    ];
    console.log(combination);
  }

  function checkTry() {
    let correct = [];
    let exist = [];
    let copyCombination = [].concat(combination);
    let copyMyTry = [].concat(myTry);

    myTry.forEach((el, index) => {
      if (el === combination[index]) {
        correct.push("correct");
        copyCombination[index] = null;
        copyMyTry[index] = null;
      }
    });

    copyMyTry.forEach((el) => {
      let index = copyCombination.indexOf(el);
      if (index !== -1 && el !== null) {
        exist.push("exist");
        copyCombination.splice(index, 1);
      }
    });

    if (correct.length === 4 || maxTry === tryNumber + 1) {
      for (let i = 0; i < symbols.length; i++) {
        symbolGridBox.children[i].removeEventListener("click", setMyTry);
      }
      renderFinalResult();
      wrongSound.play();

      if (tryNumber + 1 === 1 && correct.length === 4) {
        messageNotice.innerHTML = "Bravo osvojili ste 30 poena";
      } else if (tryNumber + 1 === 2 && correct.length === 4) {
        messageNotice.innerHTML = "Bravo osvojili ste 25 poena";
      } else if (tryNumber + 1 === 3 && correct.length === 4) {
        messageNotice.innerHTML = "Bravo osvojili ste 20 poena";
      } else if (tryNumber + 1 === 4 && correct.length === 4) {
        messageNotice.innerHTML = "Bravo osvojili ste 15 poena";
      } else if (tryNumber + 1 === 5 && correct.length === 4) {
        messageNotice.innerHTML = "Bravo osvojili ste 10 poena";
      } else if (tryNumber + 1 === 6 && correct.length === 4) {
        document.querySelector(".message").innerHTML =
          "Bravo osvojili ste 5 poena";
      } else if (correct.length != 4 && maxTry === tryNumber + 1) {
        messageNotice.innerHTML =
          "Niste osvojili poene, vise srece sledeci put!";
      }
    }
    currentResult = correct.concat(exist);
  }

  function setMyTry() {
    if (myTry.length < 4) {
      clickSound.pause();
      let symbolIndex = parseInt(this.getAttribute("data-symbolIndex"));
      myTry.push(symbolIndex);
      renderTry();
      clickSound.currentTime = 0;
      clickSound.play();
    }

    if (myTry.length === 4) {
      checkTry();
      renderResultCurrentTry();
      tryNumber++;
      myTry = [];
      currentResult = [];
    }
  }

  function renderBoard() {
    let textSquare = "";
    let textCircle = "";
    let finalTextSquare = "";

    for (let i = 0; i < maxTry; i++) {
      textSquare += `
            <div class="row">
                <div class="box"></div>
                <div class="box"></div>
                <div class="box"></div>
                <div class="box"></div>
            </div>`;
      textCircle += `
            <div class="row">
            <div class="rect"><div class="circle circle-${i}-0"></div></div>
            <div class="rect"><div class="circle circle-${i}-1"></div></div>
            <div class="rect"><div class="circle circle-${i}-2"></div></div>
            <div class="rect"><div class="circle circle-${i}-3"></div></div>                
            </div>`;
    }
    finalTextSquare += `
            <div class="row" id="final-row">
                <div class="box"></div>
                <div class="box"></div>
                <div class="box"></div>
                <div class="box"></div>
            </div>`;

    tryGridBox.innerHTML = textSquare;
    resultGridBox.innerHTML = textCircle;
    finalResultDiv.innerHTML = finalTextSquare;

    tryRow = tryGridBox.querySelectorAll(".row");
    checkRow = resultGridBox.querySelectorAll(".row .circle");
  }

  function renderSymbols() {
    symbols.forEach((symbol, index) => {
      let box = document.createElement("div");
      let img = document.createElement("img");
      box.className = "box";
      box.setAttribute("data-symbolIndex", index);
      img.src = symbol;
      // box.onclick = setMyTry
      box.addEventListener("click", setMyTry);
      box.appendChild(img);
      symbolGridBox.appendChild(box);
    });
  }

  function renderTry() {
    myTry.forEach((symbolIndex, index) => {
      tryRow[tryNumber].children[
        index
      ].innerHTML = `<img src="${symbols[symbolIndex]}" >`;
    });
  }

  function renderResultCurrentTry() {
    currentResult.forEach((result, index) => {
      const circleElement = document.querySelector(
        `.circle-${tryNumber}-${index}`
      );
      circleElement.classList.add(result);
    });
  }

  function renderFinalResult() {
    const finalRow = document.getElementById("final-row");
    const boxes = finalRow.querySelectorAll(".box");
    for (let i = 0; i < boxes.length; i++) {
      boxes[i].innerHTML = `<img src="${symbols[combination[i]]}">`;
    }
  }

  function renderButtons() {
    /* izmenio sam selektor, da bi selektovao onaj div koji sam dodao */
    let buttons = document.querySelector(".buttons .appendButtons");
    /* pre svakog renderovanja mora se isprazniti div da se ne bi dugmici ponavljali */
    buttons.innerHTML = "";
    buttons.innerHTML += exitButtonAdd;
    buttons.innerHTML += stopMusicBtnAdd;
    buttons.innerHTML += playMusicBtnAdd;

    let exitButtonSelect = document.getElementById("exit-button");
    exitButtonSelect.removeEventListener("click", exitButtonHandler);
    exitButtonSelect.addEventListener("click", exitButtonHandler);

    function exitButtonHandler() {
      window.location.reload();
    }

    let stopMusicSelect = document.getElementById("stop-music-button");
    stopMusicSelect.removeEventListener("click", stopMusicHandler);
    stopMusicSelect.addEventListener("click", stopMusicHandler);

    function stopMusicHandler() {
      backgroundMusic.pause();
    }

    let playMusicSelect = document.getElementById("play-music-button");
    playMusicSelect.removeEventListener("click", playMusicHandler);
    playMusicSelect.addEventListener("click", playMusicHandler);
    function playMusicHandler() {
      backgroundMusic.play();
    }
  }

  function randomNumber() {
    return Math.floor(Math.random() * symbols.length);
  }
}
