var shuffle = require('./shuffle');

module.exports =  {
    generateRandomNumber,
    smallNumberList,
    largeNumberList,
    getLarge,
    getSmall
}

function getRandomNumber(room) {
    var randomNumber = generateRandomNumber(1, 1000);
    room.messageMembers('setRandomNumber', randomNumber);
}

function generateRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function largeNumberList() {
    var largeNumberList = [25, 50, 75, 100];
    largeNumberList = shuffle(largeNumberList);
    return largeNumberList;
}

function smallNumberList() {
    var smallNumberList = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10];
    smallNumberList = shuffle(smallNumberList);
    return smallNumberList;
}

function getLarge(arg, user) {
    var room = user.getRoom();
    var num = room.data.numbersRound.largeNumberList.shift();
    user.message('updateLarge', num);
    room.data.numbersRound.numbers.push(num);
    room.data.numbersRound.large++;
    checkNumbersLeft(room.data.numbersRound, room);
}

function getSmall(arg, user) {
    var room = user.getRoom();
    var num = room.data.numbersRound.smallNumberList.shift();
    user.message('updateSmall', num);
    room.data.numbersRound.numbers.push(num);
    room.data.numbersRound.small++;
    checkNumbersLeft(room.data.numbersRound, room);
}

function checkNumbersLeft(numbersRound, room) {
    if(numbersRound.large >= 4){
        numbersRound.disableLarge = true;
        console.log('disableLarge');
    }
    if(numbersRound.large + numbersRound.small === 6) {
        numbersRound.disableLarge = true;
        numbersRound.disableSmall = true;
        console.log('disableall');
        getRandomNumber(room);
    }
}
