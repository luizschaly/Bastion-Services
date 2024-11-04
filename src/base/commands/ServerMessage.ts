import { ApplicationCommandOptionType, ChatInputCommandInteraction, PermissionsBitField } from "discord.js"
import Command from "../classes/Command"
import CustomClient from "../classes/CustomClient"
import Category from "../enums/Category"

export default class Ticket extends Command {
    constructor(client: CustomClient){
        super(client, {
            name: "servermessage",
            description: "General server embeds.",
            category: Category.Tickets,
            default_member_permissions: PermissionsBitField.Flags.Administrator,
            dm_permission: false,
            options: [
                {
                    name: "ticketdisplay",
                    description: "Sends the make-a-ticket message.",
                    type: ApplicationCommandOptionType.Subcommand,
                    options: []
                },
                {
                    name: "purchasemessage",
                    description: "Sends the purchase message.",
                    type: ApplicationCommandOptionType.Subcommand,
                    options: []
                },
                {
                    name: "howtogetaccessmessage",
                    description: "Sends the make-a-ticket message.",
                    type: ApplicationCommandOptionType.Subcommand,
                    options: []
                },
                {
                    name: "loadersmessage",
                    description: "Sends the get loader message.",
                    type: ApplicationCommandOptionType.Subcommand,
                    options: []
                }
            ]
        })
    }
}