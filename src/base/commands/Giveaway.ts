import { ApplicationCommandOptionType, PermissionsBitField } from "discord.js"
import Command from "../classes/Command"
import CustomClient from "../classes/CustomClient"
import Category from "../enums/Category"

export default class Giveaway extends Command {
    constructor(client: CustomClient){
        super(client, {
            name: "giveaway",
            description: "General giveaway commands.",
            category: Category.Giveaways,
            default_member_permissions: PermissionsBitField.Flags.Administrator,
            dm_permission: false,
            options: [
                {
                    name: "start",
                    description: "Starts a giveaway.",
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [{
                        name: "duration",
                        description: "Duration of the giveaway in days.",
                        type: ApplicationCommandOptionType.Integer,
                        required: true
                    },
                    {
                        name: "winners",
                        description: "Amount of winners.",
                        type: ApplicationCommandOptionType.Integer,
                        required: true
                    },
                    {
                        name: "video",
                        description: "Video to like, subscribe and comment.",
                        type: ApplicationCommandOptionType.String,
                        required: true
                    },
                    {
                        name: "prize",
                        description: "Prize of the giveaway.",
                        type: ApplicationCommandOptionType.String,
                        required: true
                    },
                    {
                        name: "setwinners",
                        description: "Winners config.",
                        type: ApplicationCommandOptionType.Boolean,
                        required: true
                    },
                    ]
                }
            ]
        })
    }
}