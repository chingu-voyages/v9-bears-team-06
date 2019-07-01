'use strict'
class Blackjack {
    constructor (player) {
        this.com = {
            name: 'com',
            score: 0,
            wins: 0,
            lost: 0,
            cards: []
        }
        this.player = {
            name: player,
            score: 0,
            wins: 0,
            lost: 0,
            cards: []
        }
    }
    setPlayerCard(player, cards) {
        if (player === this.player.name) {
            this.player.cards.push(cards)
        } else {
            this.com.cards.push(cards)
        }
    }
    setWinner(player) {
        if (player === this.player.name) {
            this.player.wins += 1
        } else {
            this.com.wins += 1
        }
    }
    setLoser(player) {
        if (player === this.player.name) {
            this.player.lost += 1
        } else {
            this.com.lost += 1
        }
    }
    getCom(){
        return this.com
    }
    getPlayer() {
        return this.player
    }
    play() {
        for(var i = 0; i<4; i++) {
            if(i % 2 !== 0) {
                this.drawCard(this.player.name)
            } else {
                this.drawCard(this.com.name)
            }
        }
        this.calculateScore(this.getPlayer())
        this.calculateScore(this.getCom())
    }
    // play(command) {
    //     if(command === "hit") {
    //         this.drawCard(this.player.name)
    //         this.calculateScore(this.getPlayer())
    //     }
    // }
    drawCard (player) {
        const CARDS = ['A','2','3','4','5','6','7','8','9','10','J','Q','K']
        const SYMBOLS = ['hearts','spades','diamonds','clubs']
        let rand_value = randNum(0, CARDS.length-1)
        let rand_sym = randNum(0, SYMBOLS.length-1)
        this.setPlayerCard(player, `${CARDS[rand_value]} :${SYMBOLS[rand_sym]}:`)
        function randNum(min, max) {
            min = Math.ceil(min)
            max = Math.floor(max)
            return Math.floor(Math.random()* (max - min + 1)) + min
        }
    }
    calculateScore (player) {
        player.cards.forEach(card => {
            if (card.split(" ")[0] === "J" ||
                card.split(" ")[0] === "Q" ||
                card.split(" ")[0] === "K") {
                    player.score += 10            
                }
            else if (card.split("-")[0] === "A"){
                if(player.score < 10) {
                    player.score += 1
                } else {
                    player.score += 11
                }
            } else {
                player.score += Number(card.split(" ")[0])
            }
        })
    }
    // hit(player)
    // draw card and calculate score
    // check for bust
    // if 21 stay()

    // stay(player)
    // check com_score === 21
        // reveal dealer hand win or draw
    // com_score > 21 Bust 
    // com_score < 21 and com score > player_Score
        // com wins
    // com_score < 17 
        // draw card
    

}
module.exports = Blackjack;
