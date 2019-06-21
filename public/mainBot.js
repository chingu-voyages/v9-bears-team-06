const Discord = require('discord.js')
const jokes = require('./modules/jokeapi.js')
const blackjack = require('./game/blackjack.js')
const client = new Discord.Client()

let messageCount = 0
let commandsReceived = 0

client.on('ready', () => {
    //basic startup message when bot is started
    console.log(`Ready to serve.`)
})

client.on('message', msg => {
    messageCount++
    //logic to make sure the message didn't originate from bot
    if (msg.author == client.user) {
        return
    }
    //logic to take commands
    if (msg.content.startsWith('$')) {
        runCommand(msg.content.substr(1).toLowerCase())
        commandsReceived++
    }
})

async function runCommand(message){
    let command = message.split(' ')
    if (command.length > 1) {
        let primaryCommand = command[0]
        /*
          command args in case we want to use params for a command like "$help blackjack"
          then it would parse through the command and give help for blackjack (just an idea)
        */
        let commandArguments = command.slice(1)
        //server console output to keep a live log of pertinent activity
        console.log("Messages received: ", messageCount)
        console.log("Commands received: ", commandsReceived)
        
        console.log("Command received: ", primaryCommand)
        console.log("Command sent by: ", msg.author.username)

        console.log("Command arguments: ", commandArguments)

        switch (primaryCommand) {
            case "help":
                runHelp(commandArguments, message)
                break
            case "blackjack":
                await playBlackjack(message)
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

async function playBlackjack(message){
    //call blackjack module  
    await blackjack.play()
}

async function tellJoke(message){
    //ask for user input
    message.channel.send('What kind of joke would you like to hear? Say "categories" for help.')
    //logic to process what user has entered
    await client.on('message', msg => {
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
}

client.login(secretToken)