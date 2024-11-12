import { ActionRowBuilder, ApplicationCommandOptionType, ChatInputCommandInteraction, EmbedBuilder, ModalActionRowComponentBuilder, ModalBuilder, PermissionsBitField, TextInputBuilder, TextInputStyle } from "discord.js"
import Command from "../classes/Command"
import CustomClient from "../classes/CustomClient"
import Category from "../enums/Category"
import Colors from "../enums/Colors"

export default class Test extends Command {
    constructor(client: CustomClient){
        super(client, {
            name: "test",
            description: "Claims the customer role.",
            category: Category.SellAuth,
            default_member_permissions: PermissionsBitField.Flags.Administrator,
            dm_permission: false,
            options: [{
                name: "user",
                description: "Sends the make-a-ticket message.",
                type: ApplicationCommandOptionType.String,
                options: []
            },
            {
                name: "messageid",
                description: "Sends the make-a-ticket message.",
                type: ApplicationCommandOptionType.String,
                options: []
            },]
        })
    
    } 
    async Execute(interaction: ChatInputCommandInteraction) {
        const msgid = interaction.options.getString("messageid")
        const user = interaction.options.getString("user")
        const message = await interaction.channel?.messages.fetch(msgid!)
        const embed = new EmbedBuilder()
        .setTitle("Giveaway Ended")
        .setDescription("Make a ticket on #Make-A-Ticket to claim your giveaway")
        .setColor(Colors.Invisible)
        message?.reply({embeds: [embed], content: `<@${user}>`})
    }
}