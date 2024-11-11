import { ActionRowBuilder, ChatInputCommandInteraction, EmbedBuilder, ModalActionRowComponentBuilder, ModalBuilder, PermissionsBitField } from "discord.js"
import Command from "../classes/Command"
import CustomClient from "../classes/CustomClient"
import Category from "../enums/Category"
import Emojis from "../enums/Emojis"
import Colors from "../enums/Colors"

export default class ServerMessageStatusMessage extends Command {
    constructor(client: CustomClient){
        super(client, {
            name: "servermessage.statusmessage",
            description: "Sends the status message.",
            category: Category.SellAuth,
            default_member_permissions: PermissionsBitField.Flags.UseApplicationCommands,
            dm_permission: false,
            options: []
        })
    
    } 
    async Execute(interaction: ChatInputCommandInteraction) {
       const embed = new EmbedBuilder()
       .setTitle("Product Status")
       .setColor(Colors.Invisible)
       .setDescription("Click on the title to view the status of all of our products, ensuring you dont buy anything thats currently detected/updating.")
        //@ts-ignore
       interaction.channel?.send({embeds: [embed]})
    }
}