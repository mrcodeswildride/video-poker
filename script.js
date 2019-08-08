var resultDisplay = document.getElementById("result");
var cardDivs = document.querySelectorAll(".card");
var creditsDisplay = document.getElementById("credits");
var dealDrawButton = document.getElementById("dealDraw");

var payout = {
    "Royal flush": 800,
    "Straight flush": 50,
    "Four of a kind": 25,
    "Full house": 9,
    "Flush": 6,
    "Straight": 4,
    "Three of a kind": 3,
    "Two pair": 2,
    "Jacks or better": 1,
    "Pair": 0,
    "High card": 0
};

var cards = [];
var hand = [];
var credits = 100;
var currentIndexInDeck = 0;

createCards();
dealDrawButton.addEventListener("click", dealDraw);

for (var i = 0; i < cardDivs.length; i++) {
    cardDivs[i].addEventListener("click", selectCard);
}

function createCards() {
    for (var rank = 2; rank <= 14; rank++) {
        for (var suit = 0; suit <= 3; suit++) {
            var card = {
                rank: rank,
                suit: suit
            };

            cards.push(card);
        }
    }
}

function dealDraw() {
    if (currentIndexInDeck == 0) {
        shuffleCards();
        clearSelected();
        placeCards();

        credits--;

        resultDisplay.innerHTML = "Click a card to hold";
        creditsDisplay.innerHTML = "Credits: " + credits;
        dealDrawButton.innerHTML = "Draw";

    }
    else {
        placeCards();

        var result = getResult();
        credits += payout[result];
        currentIndexInDeck = 0;

        resultDisplay.innerHTML = result + ": " + payout[result] + " " + (payout[result] == 1 ? "credit" : "credits");
        creditsDisplay.innerHTML = "Credits: " + credits;
        dealDrawButton.innerHTML = "Deal";

        if (credits == 0) {
            dealDrawButton.disabled = true;
        }
    }
}

function selectCard() {
    if (currentIndexInDeck > 0) {
        this.classList.toggle("selected");
    }
}

function shuffleCards() {
    for (var i = 0; i < 500; i++) {
        var r1 = Math.floor(Math.random() * cards.length);
        var r2 = Math.floor(Math.random() * cards.length);

        var temp = cards[r1];
        cards[r1] = cards[r2];
        cards[r2] = temp;
    }
}

function clearSelected() {
    for (var i = 0; i < cardDivs.length; i++) {
        cardDivs[i].classList.remove("selected");
    }
}

function placeCards() {
    for (var i = 0; i < cardDivs.length; i++) {
        if (!cardDivs[i].classList.contains("selected")) {
            var card = cards[currentIndexInDeck];

            var cardImage = document.createElement("img");
            var cardImageName = getCardImageRank(card.rank) + getCardImageSuit(card.suit);
            cardImage.setAttribute("src", "cards/" + cardImageName + ".png");

            cardDivs[i].innerHTML = "";
            cardDivs[i].appendChild(cardImage);

            hand[i] = card;
            currentIndexInDeck++;
        }
    }
}

function getCardImageRank(rank) {
    var ranks = {
        11: "J",
        12: "Q",
        13: "K",
        14: "A"
    };

    return ranks[rank] ? ranks[rank] : rank;
}

function getCardImageSuit(suit) {
    var suits = ["C", "D", "H", "S"];

    return suits[suit];
}

function getResult() {
    var ranks = getRanksDict();
    var suits = getSuitsDict();

    var numPairs = getNumOfAKind(ranks, 2);
    var numThreeOfAKind = getNumOfAKind(ranks, 3);
    var numFourOfAKind = getNumOfAKind(ranks, 4);
    var straight = isStraight(ranks);
    var flush = isFlush(suits);

    if (flush && straight) {
        return isRoyal(ranks) ? "Royal flush" : "Straight flush";
    }
    if (numFourOfAKind == 1) {
        return "Four of a kind";
    }
    else if (numThreeOfAKind == 1 && numPairs == 1) {
        return "Full house";
    }
    else if (flush) {
        return "Flush";
    }
    else if (straight) {
        return "Straight";
    }
    else if (numThreeOfAKind == 1) {
        return "Three of a kind";
    }
    else if (numPairs == 2) {
        return "Two pair";
    }
    else if (numPairs == 1) {
        return isJacksOrBetter(ranks) ? "Jacks or better" : "Pair";
    }
    else {
        return "High card";
    }
}

function getNumOfAKind(ranks, num) {
    var numOfAKind = 0;

    for (var rank in ranks) {
        if (ranks[rank] == num) {
            numOfAKind++;
        }
    }

    return numOfAKind;
}

function isStraight(ranks) {
    var lowestRank = null;

    for (var rank in ranks) {
        rank = parseInt(rank, 10);

        if (lowestRank == null || rank < lowestRank) {
            lowestRank = rank;
        }
    }

    if (ranks[lowestRank + 1] && ranks[lowestRank + 2] && ranks[lowestRank + 3] && ranks[lowestRank + 4]) {
        return true;
    }
    else if (ranks[14] && ranks[2] && ranks[3] && ranks[4] && ranks[5]) {
        return true;
    }
    else {
        return false;
    }
}

function isFlush(suits) {
    for (var suit in suits) {
        if (suits[suit] == 5) {
            return true;
        }
    }

    return false;
}

function isJacksOrBetter(ranks) {
    return ranks[11] == 2 || ranks[12] == 2 || ranks[13] == 2 || ranks[14] == 2;
}

function isRoyal(ranks) {
    return ranks[10] && ranks[11] && ranks[12] && ranks[13] && ranks[14];
}

function getRanksDict() {
    var ranks = {};

    for (var i = 0; i < hand.length; i++) {
        var rank = hand[i].rank;

        if (ranks[rank]) {
            ranks[rank]++;
        }
        else {
            ranks[rank] = 1;
        }
    }

    return ranks;
}

function getSuitsDict() {
    var suits = {};

    for (var i = 0; i < hand.length; i++) {
        var suit = hand[i].suit;

        if (suits[suit]) {
            suits[suit]++;
        }
        else {
            suits[suit] = 1;
        }
    }

    return suits;
}
