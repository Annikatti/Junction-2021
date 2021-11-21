//----------EDIT THIS ARRAY TO ADD MORE WORDS-------------

var words =["nice","kind", "friendly", "warm", "skilled", "flower", "cute", "beautiful", "awesome", "empathic"];

//------------------------------------------------------

//arvotaan sana arraysta
var index = Math.round(Math.random()*(words.length-1));
var wordArray = words[index].split("");
console.log(words[index])
var fail = 0;

//teksti jota tulostetaan sivulle
var text =""
//array jolla tarkistetaan vastaukset
var textArray =[]

for (i=0; i<wordArray.length; i++){
    text += "_ "
    textArray.push("_ ")
}
document.getElementById("guessLines").innerHTML = text;
document.getElementById("tree").src= "hangman_images/initialise.png"

//Verrataan arvausta oikeaan stringiin ja tarkistetaan voitto/epäonnistuminen
function guess(){
    
    text =""
    var guess = document.getElementById("input").value;
    if(instantWin(guess)){
        return;
    }
    for(i=0; i<wordArray.length;i++){
        if (guess == wordArray[i]){
            textArray[i] = guess;
            fail ++;
        }
    }
    for(i=0; i<textArray.length; i++){
        text += textArray[i];
    }
    console.log(textArray)
    document.getElementById("guessLines").innerHTML = text;
    checkFail(guess);
    checkWin();
    document.getElementById("input").value = ""
}

//tarkistetaan epäonnistuminen ja päivitetään kuva
var counter =0;
var used = ""
function checkFail(usedLetter){
    used += usedLetter + ", "
    if (fail == 0){
        counter ++;
        console.log(counter);
        document.getElementById("tree").src= "hangman_images/phase"+counter+".png"
    }
    document.getElementById("usedLetters").innerHTML = used;
    if(counter == 6){
        document.getElementById("announce").innerHTML = "FAIL, word was " + words[index];
        document.getElementById("input").style.pointerEvents = "none";
        document.getElementById("button").style.pointerEvents = "none";
        document.getElementById("retry").style.display = "inline-block";
    }
    fail =0;
}

//TARKISTETAAN PELIN VOITTO
function checkWin(){
    var condition = 0
    for (i = 0; i<textArray.length; i++){
        if (textArray[i]== "_ "){
            condition++;
        }
    }

    if(condition == 0){
        document.getElementById("input").style.pointerEvents = "none";
        document.getElementById("button").style.pointerEvents = "none";
        document.getElementById("announce").innerHTML = "Correct, remember to be more empathic =)";
        document.getElementById("back").style.display = "inline-block";
    }
}

function instantWin(guess){
    if(guess == words[index]){
        document.getElementById("announce").innerHTML = "Correct, remember to be more empathic =)";
        document.getElementById("guessLines").innerHTML = words[index];
        return true;
    }
}

function back() {
    window.location.href = "chat.html";
}

function retry() {
    window.location.href = "hangman.html";
}