const Discord = require('discord.js')
const jokes = require('../modules/jokeapi.js')
const blackjack = require('../game/blackjack.js')
const client = new Discord.Client()

require('dotenv').config({ path: '../.env'})
console.log(process.env.BOT_TOKEN)

let state = {
    currentGame: false,
    currentPlayer: '',
}

//basic startup message when bot is started
client.on('ready', () => {

    console.log(`Ready to serve.`)

})

//when a new user joins the server
client.on('guildMemberAdd', member => {

    let channel = member.guild.channels.find(ch => ch.name == 'general')

    channel.send(getGreeting(member))

})

client.on('message', msg => {

    console.log(`Message sent by: ${msg.author.username}`)
    console.log(`Message contents: ${msg.content}`)
    //don't respond to bot messages
    if (msg.author == client.user) {

        return

    }
    //command input symbol is a dollar sign ($)
    if ( msg.content.startsWith('$') ) {

        runCommand(msg)

    }

})

async function runCommand(message) {

    //need to make sure the input will match whether capitalized or not
    let command = message.content.substr(1).split(' ')

    if (command.length > 0) {
        
        let primaryCommand = command[0]
        /*
          command args in case we want to use params for a command like "$help blackjack"
          then it would parse through the command and give help for blackjack
        */
        let commandArguments = command.slice(1)
        //server console output to keep a live log of pertinent activity
        
        console.log("Command received: ", primaryCommand)
        console.log("Command sent by: ", message.author.username)
        console.log("Command arguments: ", commandArguments)

        switch (primaryCommand) {
            //switch statement to handle the different commands available
            case "help":

                runHelp(commandArguments, message)

                break

            case "blackjack": //play blackjack

                let player = message.author.username

                if( state['currentGame'] ) {

                    message.reply(` please wait your turn. I'm not WATSON, I can only handle 1 player`)

                } else {

                    await playBlackjack(message, player)
                
                }

                break

            case "joke": //tells a joke
                
                tellJoke(message)
                
                break

            default:
                
                message.channel.send(`${primaryCommand} is not a valid command. Try '$help'`)
                
                break
        
        }

    }

}

function runHelp(commandArgs, message){
    //basic help output
    if (commandArgs.length > 0) {

        message.channel.send(`I cannot help you with ${commandArgs}`)

    } else {

        message.reply('Here is a list of current commands:')
        setTimeout( () => {
            message.channel.send('$joke')
            message.channel.send('$blackjack')
        }, 2000)

    }

}

async function playBlackjack(message, player) {
    
    const game = new blackjack(player)
    
    state['currentGame'] = true

    state['currentPlayer'] = player
    
    game.newGame()
    
    game.play()
        
        let dealerCards = game.getCom().cards
        let playerCards = game.getPlayer().cards
        let playerScore = game.getPlayer().score
        let dealerScore = game.getCom().score
        let lastDrawn = game.getPlayer().cards[playerCards.length-1]

        await message.channel.send(`Dealer cards: ${dealerCards[0]} [X]`) //hide one card for dealer's cards
        await message.channel.send(`Your cards: ${playerCards}`) //show both player cards on deal
        
        //a collector to check the messages coming in
        await gameLogic(message)

    //when game over 
    message.channel.send( ( game.getPlayer().score == 100 ) ? 'bust' : game.getPlayer().score )
    
    state['currentGame'] = false

}

const gameLogic = async (message) => {
//logic to await message for blackjack game!
    await message.channel.send('Hit or Stay?')
    let hit = await message.channel.awaitMessages( c => {
        let choice = c.content.toLowerCase()
        choice.includes('hit') }, { time: 1000 } )
        console.log(hit)
    let stay = await message.channel.awaitMessages( s => {
        let choice2 = s.content.toLowerCase()
        choice2.includes('stay')}, { time: 0 } )
    
    if (hit.length > 0) {
        await message.channel.send(`You drew: ${lastDrawn} \n Your total score: ${playerScore}`)
    }

    if (stay.length > 0) {
        return 
    }
}

function tellJoke(message){
    //ask for user input
    jokes.getJokes('Any').then(response => {

        if(response.data.type == 'twopart') {

            message.reply(response.data.setup)

            setTimeout(() => {
                message.channel.send(response.data.delivery)
            }, 3500)
            
        } else {

            message.reply(response.data.joke)

        }

    })

}

//added a greeting function that can grow as people add to the welcome array
const getGreeting = u => {
    const greeting = {
        welcome: [
            `Welcome, ${u}`, 
              `Where have you been, ${u}?`,
              `${u}, you are IT. No tag backs!`,
              `${u}, you look familiar.`,
              `Greetings, "${u}" pun intended, ${u}`,
              `There's no place like home...except when you are around ${u}.`,
              `This place might be getting a little crowded. ${u} is taking up too much hard drive space.`
            
        ]
    }

    let i = (Math.ceil(Math.random() * greeting.welcome.length)) - 1
    return greeting.welcome[i]
}


client.login(process.env.BOT_TOKEN)

