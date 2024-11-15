import { ActionRowBuilder, ChatInputCommandInteraction, EmbedBuilder, ModalActionRowComponentBuilder, ModalBuilder, PermissionsBitField } from "discord.js"
import Command from "../classes/Command"
import CustomClient from "../classes/CustomClient"
import Category from "../enums/Category"
import Emojis from "../enums/Emojis"
import Colors from "../enums/Colors"
import SubCommand from "../classes/SubCommand"

export default class ServerMessagePurchaseMessage extends SubCommand {
    constructor(client: CustomClient){
        super(client, {
            name: "servermessage.purchasemessage"
        })
    
    } 
    async Execute(interaction: ChatInputCommandInteraction) {
       const embed = new EmbedBuilder()
       .setTitle("Purchase Here")
       .setColor(Colors.Invisible)
       .setURL("https://bastionservices.wtf")
       .setImage("https://i.imgur.com/DVASrCI.png")
       .setDescription("Head to the website if you want to buy with cripto/card, to buy with paypal or PIX open a ticket, feel free to open a ticket if you encounter any problems.")
        //@ts-ignore
       interaction.channel?.send({embeds: [embed]})
    }
}