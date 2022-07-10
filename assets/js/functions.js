const gameFunctions = (() => {
    'use strict'; 

    let deck    = [];
    const types = ['SR','CR','SB','CB'];

    let scorePlayer = 0,
        scoreCPU    = 0;

    let handPlayer = [],
        handCPU    = [];

    let gameComplete = false;

    const containerPlayer = document.querySelector("#container-player"),
          containerCPU    = document.querySelector("#container-cpu"),
          buttonNewGame   = document.querySelector("#button-new-game"),
          buttonGetCard   = document.querySelector("#button-get-card"),
          buttonStop      = document.querySelector("#button-stop"),
          spanScorePlayer = document.querySelector("#score-player"),
          spanScoreCPU    = document.querySelector("#score-cpu"),
          advise          = document.querySelector("#advise");


    const initializeDeck = () => {
        
        deck = [];
        deck = createShuffleDeck();
    }

    const getCard = () => {

        if(!gameComplete){

            buttonNewGame.disabled  = false;
            buttonStop.disabled     = false;
    
            let card = createDOMCard('containerPlayer');
    
            handPlayer.push(card);
            scorePlayer = handTotalValue(handPlayer);
            spanScorePlayer.innerText = scorePlayer;
    
            if(scorePlayer > 21) {
                
                CPUTurn(scorePlayer);
                evaluateScorePlayers(scorePlayer, scoreCPU, false);
                buttonGetCard.disabled  = true;
                buttonStop.disabled     = true;
                gameComplete = true;
                
            } else if(scorePlayer == 21){
                
                evaluateScorePlayers(scorePlayer, scoreCPU, false);
                buttonGetCard.disabled  = true;
                buttonStop.disabled     = true;
                gameComplete = true;
            }
        }
    }

    const createShuffleDeck = () => {

        for (let i = 1; i <= 13; i++) {
            for (let type of types){
                deck.push({number: i, form: type[0], color: type[1], value: getCardValue(i)});
            }
        }

        return _.shuffle(deck);
    }

    const shiftCardFromDeck = () => {
    
        if (deck.length == 0) showAdvise('The deck is empty');

        return deck.shift();
    }

    const getCardValue = (cardNumber) => {

        return  (cardNumber == 11) ? 10 :
                (cardNumber == 12) ? 10 :
                (cardNumber == 13) ? 10 : cardNumber;
    }

    const createDOMCard = (containerType) => {

        const divCard       = document.createElement("div");
        const divCardType   = document.createElement("div");
        let classCard       = '';

        let card = shiftCardFromDeck();

        divCard.classList.add('card');
        divCard.setAttribute('id', card.number);

        switch (card.number) {
            case 1:  divCardType.textContent = 'A'; break;
            case 11: divCardType.textContent = 'J'; break;
            case 12: divCardType.textContent = 'Q'; break;
            case 13: divCardType.textContent = 'K'; break;

            default: divCardType.textContent = card.number;
        }

        switch (card.form) {
            case 'S': classCard = 'square'; break;
            case 'C': classCard = 'circle'; break;

            default: break;
        }

        switch (card.color) {
            case 'R': classCard += '-red'; break;
            case 'B': classCard += '-black'; break;

            default: break;
        }

        divCardType.classList.add(classCard);
        divCard.append(divCardType);

        eval(containerType+'.append(divCard)');

        return card;
    }

    const resetAllVariablesGame = () => {
        
        console.clear();

        buttonNewGame.disabled  = true;
        buttonGetCard.disabled  = false;
        buttonStop.disabled     = true;
        
        scorePlayer = 0;
        scoreCPU    = 0;

        handPlayer = [];
        handCPU    = [];

        spanScorePlayer.innerText   = scorePlayer;
        spanScoreCPU.innerText      = scoreCPU;

        containerPlayer.innerHTML   = '';
        containerCPU.innerHTML      = '';
        advise.style.visibility     = 'hidden';

        gameComplete = false;
    }

    const stopGame = () => {
        
        if(!gameComplete){

            buttonGetCard.disabled  = true;
            buttonStop.disabled     = true;
            gameComplete = true;
            
            CPUTurn(scorePlayer);
            evaluateScorePlayers(scorePlayer, scoreCPU, true);
        }
    }

    const handTotalValue = (hand) => {

        let totalValue      = 0;
        let totalValueAux   = 0;

        hand.forEach(card => {
            totalValue += card.value;
        });

        for (let indexFindFirstA in hand){
            if (hand[indexFindFirstA].value == 1) {
                for (let indexHand = 0; hand[indexHand]; indexHand += 1) {
                    (indexHand == indexFindFirstA) ? totalValueAux += 11 : totalValueAux += hand[indexHand].value;
                } 
                break;
            }
        } 

        return (totalValueAux == 21) ? totalValueAux : totalValue;
    }

    const CPUTurn = (scorePlayer) => {

        do {
            let card = createDOMCard('containerCPU');

            handCPU.push(card);
            scoreCPU = handTotalValue(handCPU);
            spanScoreCPU.innerText = scoreCPU;

            if (scorePlayer > 21) break;
            
        } while ((scoreCPU <= scorePlayer)&&(scorePlayer <= 21));
    }

    const evaluateScorePlayers = (scorePlayer, scoreCPU, stopEvent) => {

        let advise = '';

        if((scorePlayer > 21)&&(stopEvent == false)){
            advise = 'Player lose';
        } else if ((scoreCPU > scorePlayer)&&(scoreCPU <= 21)&&(stopEvent == true)){
            advise = 'CPU win';
        } else if (((scorePlayer == 21)&&(stopEvent == false))||((scorePlayer <= 21)&&(stopEvent == true))){
            advise = 'Player win!';
        }

        showAdvise(advise);
    }

    const showAdvise = (message) => {

        console.log(message);
        advise.style.visibility = 'visible';
        advise.innerHTML = message;
    }


    buttonNewGame.addEventListener ('click', () => {
        
        resetAllVariablesGame();
        initializeDeck();
    });

    buttonGetCard.addEventListener ('click', () => {
        
        getCard();
    });

    buttonStop.addEventListener ('click', () => {
        
        stopGame();
    });

    document.addEventListener('keydown', (event) => {
        
        const keyName = event.key;

        switch (keyName) {
            case '1':         
                resetAllVariablesGame();
                initializeDeck();
                break;

            case '2': getCard(); break;
            
            case '3': stopGame(); break;
        
            default: break;
        }
        
    });


    return {
        startNewGame: initializeDeck
    };

})();