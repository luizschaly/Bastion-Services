import { ActionRowBuilder, ChatInputCommandInteraction, EmbedBuilder, ModalActionRowComponentBuilder, ModalBuilder, PermissionsBitField } from "discord.js"
import Command from "../classes/Command"
import CustomClient from "../classes/CustomClient"
import Category from "../enums/Category"
import Emojis from "../enums/Emojis"
import Colors from "../enums/Colors"
import SubCommand from "../classes/SubCommand"

export default class ServerMessageHowToGetAccessMessage extends SubCommand {
    constructor(client: CustomClient){
        super(client, {
            name: "servermessage.howtogetaccessmessage"
        })
    
    } 
    async Execute(interaction: ChatInputCommandInteraction) {
       const embed = new EmbedBuilder()
       .setTitle("How to get access")
       .setColor(Colors.Invisible)
       .setDescription("To get access to our free software you need to invite `3` friends to our discord and verify, after you've done that , click on the `Get` button and the bot will dm you the archive.")
        //@ts-ignore
       interaction.channel?.send({embeds: [embed]})
    }
}