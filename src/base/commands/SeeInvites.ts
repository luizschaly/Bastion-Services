import { ActionRowBuilder, ChatInputCommandInteraction, EmbedBuilder, ModalActionRowComponentBuilder, ModalBuilder, PermissionsBitField, TextInputBuilder, TextInputStyle } from "discord.js"
import Command from "../classes/Command"
import CustomClient from "../classes/CustomClient"
import Category from "../enums/Category"
import inviteSchema from "../schemas/invite"
import Colors from "../enums/Colors"
import Emojis from "../enums/Emojis"
export default class CheckInvites extends Command {
    constructor(client: CustomClient){
        super(client, {
            name: "checkinvites",
            description: "Checks your invites.",
            category: Category.Utilities,
            default_member_permissions: PermissionsBitField.Flags.UseApplicationCommands,
            dm_permission: false,
            options: []
        })
    
    } 
    async Execute(interaction: ChatInputCommandInteraction) {
        const inviteobj = await inviteSchema.find({GuildID: interaction.guild!.id, InviteCreator: interaction.user.id})
        let realInvNum = 0
        for(const invite of inviteobj){
            realInvNum =+ invite.RealUses! || 0
        }
        const embed = new EmbedBuilder()
        .setTitle(`${interaction.user.username} Invites`)
        .setColor(Colors.Invisible)
        .addFields({name: `${Emojis.BlurpleDot}Valid Invites`, value: `${Emojis.BlurpleArrow} ${realInvNum}`})
        .setThumbnail(interaction.user.avatarURL())
        await interaction.reply({embeds: [embed]})
    }
}