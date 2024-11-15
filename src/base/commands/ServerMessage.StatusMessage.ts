import { ActionRowBuilder, ChatInputCommandInteraction, EmbedBuilder, ModalActionRowComponentBuilder, ModalBuilder, PermissionsBitField } from "discord.js"
import Command from "../classes/Command"
import CustomClient from "../classes/CustomClient"
import Category from "../enums/Category"
import Emojis from "../enums/Emojis"
import Colors from "../enums/Colors"
import SubCommand from "../classes/SubCommand"

export default class ServerMessageStatusMessage extends SubCommand {
    constructor(client: CustomClient){
        super(client, {
            name: "servermessage.statusmessage"
        })
    
    } 
    async Execute(interaction: ChatInputCommandInteraction) {
       const embed = new EmbedBuilder()
       .setTitle("Product Status")
       .setColor(Colors.Invisible)
       .setURL("https://bastionservices.wtf/status")
       .setDescription("Click on the title to view the status of all of our products, ensuring you dont buy anything thats currently detected/updating.")
        //@ts-ignore
       interaction.channel?.send({embeds: [embed]})
    }
}