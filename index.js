const { readdir } = require("fs");
const { Client } = require('discord.js');
const client = new Client({});

try {
    client.config = require('./config/config.json');
} catch (e) {
    console.log("Config file not found. Please create a config.json file in the config folder.".red);
    process.exit(1);
}

process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);
});

process.on('uncaughtException', function (err) {
    console.log('Caught exception: ' + err);
    console.log(err.stack);
});

client.on('ready', () => {
    console.log("\nBot Started!\n".rainbow.bold);

    let guildChannel = client.guilds.cache.get(client.config.guild).channels.cache.get(client.config.channel)

    setInterval(async () => {

    let messageDeleteQueue = [];

    let lastMessageId = null;
    while (true) {
        let messages = await guildChannel.messages.fetch({
            limit: 100,
            before: lastMessageId
        });
        if (messages.size === 0) {
            break;
        }
        lastMessageId = messages.last().id;
        messages.forEach(message => {
            if (message.createdTimestamp < Date.now() - 1000 * 60 * 60 * 24 * 7) messageDeleteQueue.push(message.id);
        })
    }


    await guildChannel.bulkDelete(messageDeleteQueue, true);

    }, 1000 * 60 * 60);
});

client.login(client.config.token);