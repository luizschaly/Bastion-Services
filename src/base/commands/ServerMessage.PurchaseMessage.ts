import { ActionRowBuilder, ChatInputCommandInteraction, EmbedBuilder, ModalActionRowComponentBuilder, ModalBuilder, PermissionsBitField } from "discord.js"
import Command from "../classes/Command"
import CustomClient from "../classes/CustomClient"
import Category from "../enums/Category"
import Emojis from "../enums/Emojis"
import Colors from "../enums/Colors"

export default class ServerMessagePurchaseMessage extends Command {
    constructor(client: CustomClient){
        super(client, {
            name: "servermessage.purchasemessage",
            description: "Sends the purchase message.",
            category: Category.SellAuth,
            default_member_permissions: PermissionsBitField.Flags.Administrator,
            dm_permission: false,
            options: []
        })
    
    } 
    async Execute(interaction: ChatInputCommandInteraction) {
       const embed = new EmbedBuilder()
       .setTitle("Purchase Here")
       .setColor(Colors.Invisible)
       .setURL("https://bastionservices.wtf")
       .setImage("https://i.imgur.com/DVASrCI.png")
       .setDescription("Head to the website if you want to buy with cripto/card, to buy with paypal or PIX open a ticket, feel free to open a ticket if you encounter any problems.")
        interaction.channel?.send({embeds: [embed]})
    }
}