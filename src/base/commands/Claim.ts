import { ActionRowBuilder, ChatInputCommandInteraction, EmbedBuilder, ModalActionRowComponentBuilder, ModalBuilder, PermissionsBitField, TextInputBuilder, TextInputStyle } from "discord.js"
import Command from "../classes/Command"
import CustomClient from "../classes/CustomClient"
import Category from "../enums/Category"

export default class Claim extends Command {
    constructor(client: CustomClient){
        super(client, {
            name: "claim",
            description: "Claims the customer role.",
            category: Category.SellAuth,
            default_member_permissions: PermissionsBitField.Flags.UseApplicationCommands,
            dm_permission: false,
            options: []
        })
    
    } 
    async Execute(interaction: ChatInputCommandInteraction) {
        const modal = new ModalBuilder()
        .setTitle("Claim role")
        .setCustomId("customerRoleModal")
        const invoiceTextInput = new TextInputBuilder()
        .setLabel("Invoce ID")
        .setCustomId("invoiceId")
        .setMinLength(6)
        .setStyle(TextInputStyle.Short)

        const emailInput = new TextInputBuilder()
        .setLabel("Email")
        .setCustomId("email")
        .setMinLength(4)
        .setStyle(TextInputStyle.Short)

        const invoiceRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(invoiceTextInput)
        const emailRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(emailInput)

        modal.setComponents(invoiceRow, emailRow)
        await interaction.showModal(modal)
    }
}