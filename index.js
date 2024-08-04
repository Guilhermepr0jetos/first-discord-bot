const { Client, GatewayIntentBits, EmbedBuilder, PermissionsBitField } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
const config = require('./config.json');
const validator = require('validator');

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Bot is running!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const regex = /\[([^\]]+)\]/g;

function parseArgs(messageContent) {
    const args = [];
    let match;

    // Encontra todas as correspondências no texto
    while ((match = regex.exec(messageContent)) !== null) {
        args.push(`[${match[1]}]`); // Adiciona o texto capturado ao array de argumentos
    }

    // Retorna o array de argumentos
    return args;
}

function parseArgsWithoutDelimiter(messageContent) {
    const args = [];
    let match;

    // Encontra todas as correspondências no texto
    while ((match = regex.exec(messageContent)) !== null) {
        args.push(match[1]); // Adiciona o texto capturado ao array de argumentos
    }

    // Retorna o array de argumentos
    return args;
}

function validarURL(url) {
    return validator.isURL(url);
}

function isBlank(str) {
    return (!str || /^\s*$/.test(str));
}


client.once('ready', () => {
    console.log('Bot está online!');
});

client.on('messageCreate', async message => {
    const channel = message.channel;
    const botMember = await message.guild.members.fetch(client.user.id);
    const botPermissions = channel.permissionsFor(botMember);

    if (message.author.bot == true){
        return
    };

    const args = message.content.trim().split(/ +/);
    args.shift();
    const frase = args.join(' ');

    if (message.content === '!escrever'+" "+frase) {
        //console.log(botPermissions);
        
        if (!botPermissions) {
            console.error('Não foi possível obter as permissões do bot para o canal.');
            return;
        }

        if (botPermissions.has(PermissionsBitField.Flags.SendMessages) && botPermissions.has(PermissionsBitField.Flags.EmbedLinks)) {
            console.log(args);
            message.channel.send(frase);
        } else {
            console.error('Permissão para enviar mensagens não encontrada ou permissão de inserir links não encontrada.');
        }
    }

    if (message.content === '!escreverembedhelp') {
        if (!botPermissions) {
            console.error('Não foi possível obter as permissões do bot para o canal.');
            return;
        }

        if (botPermissions.has(PermissionsBitField.Flags.SendMessages) && botPermissions.has(PermissionsBitField.Flags.EmbedLinks)) {
            const embed = new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle('Ajuda com embeds')
            .setDescription('!escreverembed [0x0099ff] [Título do Embed] [https://discord.js.org/] [Aqui está a descrição do embed.] [https://i.imgur.com/wSTFkRM.png] [Aqui está o rodapé.] [https://i.imgur.com/wSTFkRM.png] \n \n você pode deixar um argumento em branco desse jeito: [ ], com um espaço entre os colchetes, vai fazer seu argumento ser ignorado, ex: [Titulo aqui!], [ ] == seu titulo não vai aparecer no embed final. \n \n lembre-se de que "[" e "]" são delimitadores! não os repita numa frase que já está dentro de algum colchete')
            .setTimestamp()

            message.channel.send({ embeds: [embed] });
        } else {
            console.error('Permissão para enviar mensagens não encontrada ou permissão de inserir links não encontrada.');
        }

    }

    const capturedArgs = parseArgs(message.content);
    const capturedArgsWithoutDelimiter = parseArgsWithoutDelimiter(message.content)
    
    const capturedArgsfrase = capturedArgs.join(' ');

    if (message.content === '!escreverembed'+" "+capturedArgsfrase) {
        if (!botPermissions) {
            console.error('Não foi possível obter as permissões do bot para o canal.');
            return;
        }

        if (botPermissions.has(PermissionsBitField.Flags.SendMessages) && botPermissions.has(PermissionsBitField.Flags.EmbedLinks)) {
            console.log(capturedArgs);
            console.log(capturedArgsfrase);
            console.log(capturedArgsWithoutDelimiter);

            const color = parseInt(capturedArgsWithoutDelimiter[0])

            if (!isBlank(capturedArgsWithoutDelimiter[2]) || !isBlank(capturedArgsWithoutDelimiter[4]) || !isBlank(capturedArgsWithoutDelimiter[6])) {
                if (!validarURL(capturedArgsWithoutDelimiter[2]) || !validarURL(capturedArgsWithoutDelimiter[4]) || !validarURL(capturedArgsWithoutDelimiter[6])){
                    return message.channel.send('Erro: algum link está escrito errado!');
                }
            }

            const embed = new EmbedBuilder()
            if (!isBlank(color)) embed.setColor(color)
            if (!isBlank(capturedArgsWithoutDelimiter[1])) embed.setTitle(capturedArgsWithoutDelimiter[1])
            if (!isBlank(capturedArgsWithoutDelimiter[2])) embed.setURL(capturedArgsWithoutDelimiter[2])
            if (!isBlank(capturedArgsWithoutDelimiter[3])) embed.setDescription(capturedArgsWithoutDelimiter[3])
            if (!isBlank(capturedArgsWithoutDelimiter[4])) embed.setThumbnail(capturedArgsWithoutDelimiter[4])
            .setTimestamp()
            if (!isBlank(capturedArgsWithoutDelimiter[5]) && !isBlank(capturedArgsWithoutDelimiter[6])) embed.setFooter({ text: capturedArgsWithoutDelimiter[5], iconURL: capturedArgsWithoutDelimiter[6] });
        
            message.channel.send({ embeds: [embed] });
        } else {
            console.error('Permissão para enviar mensagens não encontrada ou permissão de inserir links não encontrada.');
        }

      }
});

client.login(process.env.token);
