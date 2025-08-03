let yourSum = 0;
let dealerSum = 0;

let dealerAceCount = 0;
let yourAceCount = 0;

let canHit = true;

let hidden;
let deck = [];

window.onload = function () {
  buildDeck();
  shuffleDeck();
  startGame();
};

function buildDeck() {
  let deckValues = ["A", 2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K"];
  let deckTypes = ["diamonds", "spades", "hearts", "clubs"];

  for (let i = 0; i < deckTypes.length; i++) {
    for (let j = 0; j < deckValues.length; j++) {
      deck.push(deckValues[j] + "_of_" + deckTypes[i]);
    }
  }
  console.log(deck);
}

function shuffleDeck() {
  for (let i = 0; i < deck.length; i++) {
    let j = Math.floor(Math.random() * deck.length);
    let temp = deck[i];
    deck[i] = deck[j];
    deck[j] = temp;
  }
}

function startGame() {
  hidden = deck.pop(); // value in the array, so it is a card
  dealerSum += getValue(hidden);
  dealerAceCount += checkAce(hidden); //get folded dealer's card
  console.log(hidden + "  " + dealerSum);
  while (dealerSum < 16) { //control the probability of it being over 21 
    let cardImg = document.createElement("img");
    let card = deck.pop();
    cardImg.src = "Assets/Cards/" + card + ".png";
    dealerSum += getValue(card);
    dealerAceCount += checkAce(card);
    cardImg.className = "imageFeatures";
    document.getElementById("dealer-cards").append(cardImg);
  }
  console.log(dealerSum);

  for (let i = 0; i < 2; i++) {
    let cardImg = document.createElement("img");
    let card = deck.pop();
    cardImg.src = "Assets/Cards/" + card + ".png";
    yourSum += getValue(card);
    yourAceCount += checkAce(card);
    cardImg.className = "imageFeatures";
    document.getElementById("your-cards").append(cardImg);
  }
  document.getElementById("btn3").addEventListener("click", hit);
  document.getElementById("btn4").addEventListener("click", stay);
  console.log(yourSum);
}

function hit() {
   console.log(yourSum);
   if (reduceAce(yourSum, yourAceCount) > 21 || yourSum > 21) {
    canHit = false;
    endResult(yourSum, dealerSum);
    return;
  } 
  if (!canHit) {
    endResult(yourSum, dealerSum);
    return;
  } else {
    let cardImg = document.createElement("img");
    let card = deck.pop();
    cardImg.src = "Assets/Cards/" + card + ".png";
    yourSum += getValue(card);
    yourAceCount += checkAce(card);
    cardImg.className = "imageFeatures";
    document.getElementById("your-cards").append(cardImg);
  }


}

function stay() {
  dealerSum = reduceAce(dealerSum, dealerAceCount);
  yourSum = reduceAce(yourSum, yourAceCount);
  canHit = false;
  document.getElementById("hidden-dealer").src =
    "Assets/Cards/" + hidden + ".png";
  endResult(yourSum, dealerSum);
}

function getValue(card) {
  let data = card.split("_of_"); // 4_of_clubs -> [4, clubs]
  let value = data[0];

  if (isNaN(value)) {
    if (value == "A") {
      return 11;
    } else {
      return 10;
    }
  }
  return parseInt(value);
}

function checkAce(card) {
  if (card[0] == "A") {
    return 1;
  } else {
    return 0;
  }
}

function reduceAce(playerSum, playerAceCount) {
  while (playerSum > 21 && playerAceCount > 0) {
    playerSum -= 10;
    playerAceCount -= 1;
  }
  return playerSum;
}

function endResult(yourSum, dealerSum) {
  let message1 = "";
  let messageEl1 = document.getElementById("wonLostMessage");

  if (yourSum > 21) {
    message1 = "Bust! You lost.";
  } else if (dealerSum > 21) {
    message1 = "You won!";
  } else if (yourSum == dealerSum) {
    message1 = "Tie!";
  } else if (yourSum > dealerSum) {
    message1 = "You won!";
  } else if (yourSum < dealerSum) {
    message1 = "You lost, play again!";
  }

  if (yourSum == 21 && yourSum > dealerSum) {
    message1 += " Oh, and with a BlackJack";
  }

  message1.className = "showCards";
  document.getElementById("yourCardSum").textContent += " " + yourSum;
  document.getElementById("dealerCardSum").textContent += " " + dealerSum;
  document.getElementById("HitStaySection").className = "hidden";
  messageEl1.textContent = message1;
  document.getElementById("wonLostMessage").className = "showCards";
  document.getElementById("btnPlayAgain").className = "showCards";
}

function toggleButtonShow() {
  let button1 = document.getElementById("btn");
  button1.style.display = "none";
  document.getElementById("HitStaySection").className = "show";
  document.getElementById("CardSection").className = "showCards";
}
