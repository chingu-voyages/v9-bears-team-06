'use strict'
class Blackjack {
    constructor (namep1, namep2) {
        this.p1 = {
            name: namep1,
            score: 0,
            wins: 0,
            lost: 0,
            cards: []
        }
        this.p2 = {
            name: namep2,
            score: 0,
            wins: 0,
            lost: 0,
            cards: []
        }
    }
    setPlayerCard(player, cards) {
        if (player === this.p2.name) {
            this.p2.cards.push(cards)
        } else {
            this.p1.cards.push(cards)
        }
    }
    setWinner(player) {
        if (player === this.p1.name) {
            this.p1.wins += 1
        } else {
            this.p2.wins += 1
        }
    }
    setLoser(player) {
        if (player === this.p1.name) {
            this.p1.lost += 1
        } else {
            this.p2.lost += 1
        }
    }
    getPlayer1(){
        return this.p1
    }
    getPlayer2() {
        return this.p2
    }
    drawCard (player) {
        const CARDS = ['A','2','3','4','5','6','7','8','9','10','J','Q','K']
        const SYMBOLS = ['hearts','spades','diamonds','clubs']
        let rand_value = randNum(0, CARDS.length-1)
        let rand_sym = randNum(0, SYMBOLS.length-1)
        this.setPlayerCard(player, `${CARDS[rand_value]}-${SYMBOLS[rand_sym]}`)
        function randNum(min, max) {
            min = Math.ceil(min)
            max = Math.floor(max)
            return Math.floor(Math.random()* (max - min + 1)) + min
        }
    }
    calculateScore (player) {
        player.cards.forEach(card => {
            if (card.split("-")[0] === "J" ||
                card.split("-")[0] === "Q" ||
                card.split("-")[0] === "K") {
                    player.score += 10            
                }
            else if (card.split("-")[0] === "A"){
                player.score += 1
            } else {
                player.score += Number(card.split("-")[0])
            }
        })
    }
}
module.exports = Blackjack;
