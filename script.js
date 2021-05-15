let resultParagraph = document.getElementById(`resultParagraph`)
let cardDivs = document.getElementsByClassName(`card`)
let creditsParagraph = document.getElementById(`creditsParagraph`)
let dealDrawButton = document.getElementById(`dealDrawButton`)

let payouts = {
  "Royal flush": 800,
  "Straight flush": 50,
  "Four of a kind": 25,
  "Full house": 9,
  Flush: 6,
  Straight: 4,
  "Three of a kind": 3,
  "Two pair": 2,
  "Jacks or better": 1,
  Pair: 0,
  "High card": 0,
}

let deck = []
let hand = []
let credits = 100
let currentIndexInDeck = 0

createDeck()
dealDrawButton.addEventListener(`click`, dealDraw)

for (let cardDiv of cardDivs) {
  cardDiv.addEventListener(`click`, selectCard)
}

function createDeck() {
  for (let rank = 2; rank <= 14; rank++) {
    for (let suit = 0; suit <= 3; suit++) {
      let card = {
        rank: rank,
        suit: suit,
      }

      deck.push(card)
    }
  }
}

function dealDraw() {
  if (currentIndexInDeck == 0) {
    credits--
    creditsParagraph.innerHTML = `Credits: ${credits}`

    shuffleDeck()
    clearSelected()
    placeCards()

    resultParagraph.innerHTML = `Click a card to hold`
    dealDrawButton.innerHTML = `Draw`
  } else {
    placeCards()

    let result = getResult()
    let creditsText = payouts[result] == 1 ? `credit` : `credits`
    resultParagraph.innerHTML = `${result}: ${payouts[result]} ${creditsText}`

    credits += payouts[result]
    creditsParagraph.innerHTML = `Credits: ${credits}`

    currentIndexInDeck = 0
    dealDrawButton.innerHTML = `Deal`

    if (credits == 0) {
      dealDrawButton.disabled = true
    }
  }
}

function selectCard() {
  if (currentIndexInDeck > 0) {
    this.classList.toggle(`selected`)
  }
}

function shuffleDeck() {
  for (let i = 0; i < 500; i++) {
    let randomNumber1 = Math.floor(Math.random() * deck.length)
    let randomNumber2 = Math.floor(Math.random() * deck.length)

    let temp = deck[randomNumber1]
    deck[randomNumber1] = deck[randomNumber2]
    deck[randomNumber2] = temp
  }
}

function clearSelected() {
  for (let cardDiv of cardDivs) {
    cardDiv.classList.remove(`selected`)
  }
}

function placeCards() {
  for (let i = 0; i < cardDivs.length; i++) {
    if (!cardDivs[i].classList.contains(`selected`)) {
      let card = deck[currentIndexInDeck]
      let cardRank = getCardRank(card.rank)
      let cardSuit = getCardSuit(card.suit)

      let image = document.createElement(`img`)
      image.src = `cards/${cardRank}${cardSuit}.png`
      cardDivs[i].innerHTML = ``
      cardDivs[i].appendChild(image)

      hand[i] = card
      currentIndexInDeck++
    }
  }
}

function getCardRank(rank) {
  let ranks = {
    11: `J`,
    12: `Q`,
    13: `K`,
    14: `A`,
  }

  return ranks[rank] ? ranks[rank] : rank
}

function getCardSuit(suit) {
  let suits = [`C`, `D`, `H`, `S`]

  return suits[suit]
}

function getResult() {
  let ranks = getRanksDict()
  let suits = getSuitsDict()

  let numPairs = getNumOfAKind(ranks, 2)
  let numThreeOfAKind = getNumOfAKind(ranks, 3)
  let numFourOfAKind = getNumOfAKind(ranks, 4)
  let straight = isStraight(ranks)
  let flush = isFlush(suits)

  if (flush && straight) {
    return isRoyal(ranks) ? `Royal flush` : `Straight flush`
  }
  if (numFourOfAKind == 1) {
    return `Four of a kind`
  } else if (numThreeOfAKind == 1 && numPairs == 1) {
    return `Full house`
  } else if (flush) {
    return `Flush`
  } else if (straight) {
    return `Straight`
  } else if (numThreeOfAKind == 1) {
    return `Three of a kind`
  } else if (numPairs == 2) {
    return `Two pair`
  } else if (numPairs == 1) {
    return isJacksOrBetter(ranks) ? `Jacks or better` : `Pair`
  } else {
    return `High card`
  }
}

function getNumOfAKind(ranks, num) {
  let numOfAKind = 0

  for (let rank in ranks) {
    if (ranks[rank] == num) {
      numOfAKind++
    }
  }

  return numOfAKind
}

function isStraight(ranks) {
  let lowestRank = null

  for (let rank in ranks) {
    rank = Number(rank)

    if (lowestRank == null || rank < lowestRank) {
      lowestRank = rank
    }
  }

  if (
    ranks[lowestRank + 1] &&
    ranks[lowestRank + 2] &&
    ranks[lowestRank + 3] &&
    ranks[lowestRank + 4]
  ) {
    return true
  } else if (ranks[14] && ranks[2] && ranks[3] && ranks[4] && ranks[5]) {
    return true
  } else {
    return false
  }
}

function isFlush(suits) {
  for (let suit in suits) {
    if (suits[suit] == 5) {
      return true
    }
  }

  return false
}

function isJacksOrBetter(ranks) {
  return ranks[11] == 2 || ranks[12] == 2 || ranks[13] == 2 || ranks[14] == 2
}

function isRoyal(ranks) {
  return ranks[10] && ranks[11] && ranks[12] && ranks[13] && ranks[14]
}

function getRanksDict() {
  let ranks = {}

  for (let card of hand) {
    if (!ranks[card.rank]) {
      ranks[card.rank] = 0
    }

    ranks[card.rank]++
  }

  return ranks
}

function getSuitsDict() {
  let suits = {}

  for (let card of hand) {
    if (!suits[card.suit]) {
      suits[card.suit] = 0
    }

    suits[card.suit]++
  }

  return suits
}
