const Discord = require('discord.js')
const jokes = require('../modules/jokeapi.js')
const blackjack = require('../game/blackjack.js')
const client = new Discord.Client()

require('dotenv').config({ path: '../.env'})
console.log(process.env.KEY)

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

    channel.send(`Welcome, ${member}!`)

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

function runCommand(message) {

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

                    const game = new blackjack(player)
                    //the rest of the logic
                    state['currentGame'] = true

                    state['currentPlayer'] = message.author.username
                    
                    game.newGame()
                        let dealerCards = game.getCom().cards
                        message.channel.send(`Dealer cards: ${dealerCards[0]} [X]`) //hide one card for dealer cards
                        message.channel.send(`Your cards: ${playerCards}`) //show both player cards on deal
                        //a collector to check the messages coming in
                        const collector = new Discord.MessageCollector(message.channel, 
                            m => m.author.id === message.author.id, { time: 10000 })

                        collector.on('collect', message => {
                            if (message.content.toLowerCase() == 'hit') {
                                game.hit()
                                message.channel.send(`You drew: ${}`)
                            }

                            else if (message.content.toLowerCase() == 'stay') {
                                game.stay()
                            }

                            else {
                                message.reply('Please say `hit` or `stay`')
                            }
                        })

                    //when game over 
                    message.channel.send( ( game.getPlayer().score == 100 ) ? 'bust' : game.getPlayer().score )

                    console.log(game.getPlayer())
                    
                    state['currentGame'] = false
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
    if (commandArgs.length > 0){
        message.channel.send(`I cannot help you with ${commandArgs}`)
    } else {
        message.reply('Here is a list of current commands:')
            message.channel.send('$joke')
            message.channel.send('$blackjack')
    }
}

/* 
 if (command === 'spec'){
        message.author.send("See or Change?");
        const collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, { time: 10000 });
        console.log(collector)
        collector.on('collect', message => {
            if (message.content == "See") {
                message.channel.send("You Want To See Someones Spec OK!");
            } else if (message.content == "Change") {
                message.channel.send("You Want To Change Your Spec OK!");
            }
        })
*/

/* need to figure out the message.reply with a timeout for a delayed response
   this will help with the two-part jokes
*/


function tellJoke(message){
    //ask for user input
    jokes.getJokes('Any').then(response => {

        if(response.data.type == 'twopart') {

            message.reply(response.data.setup)

            setTimeout(() => {
                message.channel.send(response.data.delivery)
            }, 2000)
            
        } else {

            message.reply(response.data.joke)

        }

    })

}

client.login(process.env.KEY)