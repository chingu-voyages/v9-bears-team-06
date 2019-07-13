const Discord = require('discord.js')
const jokes = require('../modules/jokeapi.js')
const blackjack = require('../game/blackjack.js')
const client = new Discord.Client()
const game = new blackjack()

let state = {
    currentGame: false
}

client.on('ready', () => {
    //basic startup message when bot is started
    console.log(`Ready to serve.`)
})

client.on('guildMemberAdd', member => {
    let channel = member.guild.channels.find(ch => ch.name == 'general')
    channel.send(`Welcome, ${member}!`)
})

client.on('message', msg => {
    console.log(`Message sent by: ${msg.author.username}`)
    console.log(`Message contents: ${msg.content}`)
    //logic to make sure the message didn't originate from bot
    if (msg.author == client.user) {
        return
    }
    //logic to take commands
    if (msg.content.startsWith('$')) {
        runCommand(msg)
    }
})

async function runCommand(message){
    let command = message.content.substr(1).split(' ')
    if (command.length > 0) {
        let primaryCommand = command[0]
        /*
          command args in case we want to use params for a command like "$help blackjack"
          then it would parse through the command and give help for blackjack (just an idea)
        */
        let commandArguments = command.slice(1)
        //server console output to keep a live log of pertinent activity
        
        console.log("Command received: ", primaryCommand)
        console.log("Command sent by: ", message.author.username)

        console.log("Command arguments: ", commandArguments)

        switch (primaryCommand) {
            case "help":
                runHelp(commandArguments, message)
                break
            case "blackjack":
                let player = message.author.username
                if(state[currentGame]){
                    message.reply(` please wait for your turn. I'm not WATSON, I can only handle 1 player`)
                } else {
                    //the rest of the logic
                
                game.play(player)
                //show the scores
                //if message == 'hit'
                game.hit(player)
                //when game over 
                //play again? yes or no
                /*if no -> let index = state.findIndex((player) => {
                    state.gameID == player
                })
                state.splice(index, 1)
                */
                }
                break
            case "joke":
                tellJoke(message)
                break
            default:
                message.channel.send(`${primaryCommand} is not a valid command`)
                break
        }

    }

}

function runHelp(commandArgs, message){
    //basic help output
    if (commandArgs.length > 0){
        message.channel.send(`I cannot help you with ${commandArgs}`)
    } else {
        message.channel.send('Let me tell you how I work...')
    }
}

function playBlackjack(message){
    //call blackjack module  
    blackjack.play()
}

/* need to figure out the message.reply with a timeout for a delayed response
   this will help with the two-part jokes
*/

/*
function tellJoke(message){
    respondToMsg(message)
    //ask for user input
     message.channel.send('What kind of joke would you like to hear? Say "categories" for help.')
    //logic to process what user has entered
    client.on('message', msg => {
        //categories requested
        if (msg.content.toLowerCase() == "categories") {
            msg.channel.send(jokes.getCategories())
        }
        //if a category is listed, then fetch a joke
        if (msg.content.includes(jokes.getCategories())){
            msg.channel.send(jokes.getJokes(msg.content))
        }
        else {
            msg.channel.send("I'm supposed to tell the jokes!")
        }
    })
}*/
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

client.login("NTg4NTA4MDg4OTY2MDUzODk5.XQG03Q.zvc2ssdITVuSTR4imaZCgh5gqAc")