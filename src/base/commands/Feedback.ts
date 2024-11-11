import { ApplicationCommandOptionType, ChatInputCommandInteraction, EmbedBuilder, PermissionsBitField } from "discord.js"
import Command from "../classes/Command"
import CustomClient from "../classes/CustomClient"
import Category from "../enums/Category"
import feedbackSchema from "../schemas/feedbacks"
import Colors from "../enums/Colors"
import Emojis from "../enums/Emojis"
import Channels from "../enums/Channels"

export default class Feedback extends Command {
    constructor(client: CustomClient){
        super(client, {
            name: "feedback",
            description: "Add a feedback.",
            category: Category.Utilities,
            default_member_permissions: PermissionsBitField.Flags.UseApplicationCommands,
            dm_permission: false,
            options: [
                {
                    name: "rating",
                    description: "Rating of the service we provided you.",
                    type: ApplicationCommandOptionType.String,
                    required: true,
                    choices: [{name:"⭐",value: "⭐"}, {name:"⭐⭐",value:"⭐⭐"}, {name:"⭐⭐⭐",value:"⭐⭐⭐"}, {name:"⭐⭐⭐⭐",value:"⭐⭐⭐⭐"}, {name:"⭐⭐⭐⭐⭐",value:"⭐⭐⭐⭐⭐"}]
                },
                {
                    name: "message",
                    description: "Message to be in your feedback.",
                    type: ApplicationCommandOptionType.String,
                    required: true
                }
            ]
        })
    }
    async Execute(interaction:ChatInputCommandInteraction){
        await interaction.deferReply({ ephemeral: true });
        let feedbackObj = await feedbackSchema.findOne({GuildID: interaction.guild!.id})
        if(!feedbackObj) feedbackObj = await feedbackSchema.create({GuildID: interaction.guild?.id, FeedbackedMembers: []})
        const embed = new EmbedBuilder()
        .setTitle("User already feedbacked")
        .setDescription("You have already given a feedback.")
        .setColor(Colors.Error)
        if(feedbackObj.FeedbackedMembers.includes(interaction.user.id)) return interaction.editReply({embeds: [embed]})
        const description = interaction.options.getString("message")
        const rating = interaction.options.getString("rating")
        let stars = ""
        for(let i = 0; i<rating!.length; i++){
            stars += "<:blurplestar:1299461891583774730>"
        }
        const feedbackEmbed = new EmbedBuilder()
        .setTitle("New Feedback")
        .setDescription(description)
        .setColor(Colors.Invisible)
        .addFields({name: `${Emojis.BlurpleDot} Rating`, value: `${Emojis.BlurpleArrow} ${stars}`})
        .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()! })
        const channel = await interaction.guild!.channels.fetch(Channels.FeedbackLogs)
        //@ts-ignore
        channel!.send({embeds: [feedbackEmbed]})
        const successEmbed = new EmbedBuilder()
        .setTitle("Feedback sent successfully")
        .setDescription("Your feedback has been sent successfully, thanks for the review.")
        .setColor(Colors.Success)
        await interaction.editReply({embeds: [successEmbed]})
        feedbackObj.FeedbackedMembers.push(interaction.user.id)
        await feedbackSchema.updateOne({GuildID: interaction.guild!.id}, feedbackObj)
    }
}