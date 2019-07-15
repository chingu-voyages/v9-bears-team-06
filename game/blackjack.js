class Blackjack {
    constructor (player) {
        this.com = {
            name: 'com',
            score: 0,
            wins: 0,
            lost: 0,
            draw: 0,
            cards: [],
            busted: false
        }
        this.player = {
            name: player,
            score: 0,
            wins: 0,
            lost: 0,
            draw: 0,
            cards: [],
            busted: false
        }
    }
    newGame () {
        this.player.cards = []
        this.player.score = 0
        this.com.score = 0
        this.com.cards = []
    }
    setPlayerCard(player, cards) {
        if (player === this.player.name) {
            this.player.cards.push(cards)
        } else {
            this.com.cards.push(cards)
        }
    }
    setDraw() {
        this.player.draw += 1
        this.com.draw += 1
    }
    setWinner(player) {
        if (player === this.player.name) {
            this.player.wins += 1
            this.com.lost += 1
        } else {
            this.com.wins += 1
            this.player.lost += 1
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
    drawCard (player) {
        const CARDS = ['A','2','3','4','5','6','7','8','9','10','J','Q','K']
        const SYMBOLS = [':hearts:',':spades:',':diamonds:',':clubs:']
        let rand_value = randNum(0, CARDS.length-1)
        let rand_sym = randNum(0, SYMBOLS.length-1)
        this.setPlayerCard(player, `${CARDS[rand_value]} ${SYMBOLS[rand_sym]}`)
        function randNum(min, max) {
            min = Math.ceil(min)
            max = Math.floor(max)
            return Math.floor(Math.random()* (max - min + 1)) + min
        }
    }
    calculateScore (player) {
        player.score = 0 // reset score each time
        let num_aces = 0 // number of aces counter
        let curr_score = player.score
        player.cards.forEach(card => {
            if (card.split(" ")[0] === "J" ||
                card.split(" ")[0] === "Q" ||
                card.split(" ")[0] === "K") {
                    curr_score += 10            
                }
            else if (card.split(" ")[0] === "A"){
                curr_score += 11 // add 11 everything you see an Ace
                num_aces++ // increate count
            } else {
                curr_score += Number(card.split(" ")[0])
            }
        })
        //transorm ACE's to 1 if the value is greater than 21
        while(num_aces >0) { // as long as there is aces
            if(curr_score > 21) { // if the total score > 21 substract 10 decrease 1 ACE
                curr_score -= 10
                num_aces -= 1
            } else {
                break
            }
        }
        if (curr_score > 21) {
            player.score = curr_score
            player.busted = true
        } else {
            player.score = curr_score
        }
    }
    hit() {
        let score = 0
        this.drawCard(this.getPlayer().name)
        this.calculateScore(this.getPlayer())
        score = this.getPlayer().score
    }
    stay() {
        let flag = true
        let playerScore = this.getPlayer().score
        let comScore = this.getCom().score
        while (comScore < 17) { 
            this.drawCard(this.getCom().name)
            this.calculateScore(this.getCom())
            comScore = this.getCom().score
        }
        if (comScore === playerScore) {
            this.setDraw()
            return 0
        } else if (this.com.busted) {
            this.setWinner(this.player.name)
            return 2
        } else if (this.player.busted) {
            this.setWinner(this.com.name)
            return 1
        } else if (playerScore > comScore) {
            this.setWinner(this.player.name)
            return 2
        } else if (playerScore < comScore) {
            this.setWinner(this.com.name)
            return 1
        } 
    }
}
module.exports = Blackjack;
