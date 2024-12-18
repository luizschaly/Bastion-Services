import { ActionRowBuilder, ApplicationCommandOptionType, ChatInputCommandInteraction, EmbedBuilder, ModalActionRowComponentBuilder, ModalBuilder, PermissionsBitField, TextInputBuilder, TextInputStyle } from "discord.js"
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
            options: [{
                name: "user",
                description: "User to check the invites ",
                type: ApplicationCommandOptionType.User,
                required: false
              },]
        })
    
    } 
    async Execute(interaction: ChatInputCommandInteraction) {
        let user = interaction.options.getUser("user")
        if(!user) user = interaction.user
        const inviteobj = await inviteSchema.find({GuildID: interaction.guild!.id, InviteCreator: user.id})
        let realInvNum = 0
        for(const invite of inviteobj){
            realInvNum =+ invite.RealUses! || 0
        }
        const embed = new EmbedBuilder()
        .setTitle(`${user.displayName} Invites`)
        .setColor(Colors.Invisible)
        .addFields({name: `${Emojis.BlurpleDot}Valid Invites`, value: `${Emojis.BlurpleArrow} ${realInvNum}`})
        .setThumbnail(user.avatarURL())
        await interaction.reply({embeds: [embed]})
    }
}