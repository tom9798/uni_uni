const prompt = require('prompt-sync')();

const ROWS = 3;
const COLS = 3;
const SYMBOLS_COUNT = {
    "A":2,
    "B":4,
    "C":6,
    "D":8,
}

const SYMBOL_VALUES = {
    "A": 5,
    "B": 4,
    "C": 3,
    "D": 2,
}

const deposit = () => {
  while (true){
    const depositAmount = prompt('How much would you like to deposit? ');
    const numberDeposit = parseFloat(depositAmount);
    if (isNaN(numberDeposit)|| numberDeposit <= 0) {
    console.log('Please enter a number greater than 0');
    }
    else {
      console.log(`Thanks for your deposit of ${numberDeposit}`);
      return numberDeposit;
    }
  }
}

const getNumberOfLines = () => {
    while (true) {
        const lines = prompt('How many lines would you like to play? ');
        const numberLines = parseFloat(lines);
        if (isNaN(numberLines) || numberLines <= 0 || numberLines > 3) {
            console.log('invalid number of lines');
        }
        else {
            console.log(`OK, ${numberLines} lines coming up!`);
            return numberLines;
        }
    }
}

const getBet = (balance) => {
    while (true) {
        const bet = prompt('How much would you like to bet on? ');
        const numberBet = parseFloat(bet);
        if (isNaN(numberBet) || numberBet <= 0 || numberBet > balance) {
            console.log('invalid bets');
        }
        else {
            console.log(`OK, betting ${numberBet}`);
            return numberBet;
        }
    }
}

const spin = () => {
    const symbols = [];
    for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
        for (let i = 0; i < count; i++) {
            symbols.push(symbol);
        }
    }
    const reels = [[], [], []];
    for (let i = 0; i < COLS; i++) {
        const reelSymbols = [...symbols];
        for (let j = 0; j < ROWS; j++) {
            const randomIndex = Math.floor(Math.random() * reelSymbols.length);
            const slectedSymbol = reelSymbols[randomIndex];
            reels[i].push(slectedSymbol);
            reelSymbols.splice(randomIndex, 1);
        }
    }
    return reels;
}


const reels = spin()
console.log(reels);
let balance = deposit();
const numberOfLines = getNumberOfLines();
const bet = getBet(balance);