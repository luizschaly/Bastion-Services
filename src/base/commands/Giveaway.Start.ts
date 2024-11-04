import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, EmbedBuilder, EmbedFooterOptions, UserSelectMenuBuilder } from "discord.js"
import CustomClient from "../classes/CustomClient"
import SubCommand from "../classes/SubCommand"
import Colors from "../enums/Colors"
import giveawaySchema from "../schemas/giveaway"
import IGiveaway from "../interfaces/IGiveaway"
import {v4 as uuidv4} from "uuid"
import Emojis from "../enums/Emojis"

export default class GiveawayStart extends SubCommand {
    constructor(client: CustomClient){
        super(client, {
            name: "giveaway.start"
        })
    }

    async Execute(interaction: ChatInputCommandInteraction): Promise<void> {
        const duration = interaction.options.getInteger("duration")!
        const winners = interaction.options.getInteger("winners")!
        const prize = interaction.options.getString("prize")!
        const video = interaction.options.getString("video")!
        const setWinners = interaction.options.getBoolean("setwinners")!
        const totalTime = duration * 60 
        const giveawayId = uuidv4()
        const giveawayObj: IGiveaway = {
            prize: prize,
            winnersAmount: winners,
            video: video,
            duration: totalTime,
            setWinners: setWinners,
            ChannelID: interaction.channel!.id,
            GuildID: interaction.guild!.id,
            GiveawayID: giveawayId,
            winners: [],
            participants: [],
            MessageID: undefined
        }

        if(!setWinners){
            const embed = new EmbedBuilder()
        .setTitle(`${giveawayObj!.winnersAmount}x ${giveawayObj!.prize}`)
        .setDescription(`${Emojis.BlurpleDot} Like, comment and subscribe to this channel/video [video](${giveawayObj?.video})`)
        .addFields({
            name: `${Emojis.BlurpleDot} Entries`,
            value: `${Emojis.BlurpleArrow} 0`
        },
        {
            name: `${Emojis.BlurpleDot} Ends`,
            value: `${Emojis.BlurpleArrow} <t:${Math.floor(Date.now() / 1000) + giveawayObj!.duration!}:R>`
        })
        .setColor(Colors.Invisible)
        .setFooter({text: giveawayObj!.GiveawayID!})
        const participateButton = new ButtonBuilder()
        .setLabel("Participate")
        .setCustomId("giveawayParticipate")
        .setStyle(ButtonStyle.Success)
        .setEmoji("<:blurpleannouncement:1299582203977797653>")
        const row = new ActionRowBuilder().addComponents(participateButton)

        //@ts-ignore
        const message = await interaction.channel!.send({embeds: [embed], components: [row]})
        giveawayObj!.MessageID = message.id
        await giveawaySchema.create(giveawayObj)
        this.client.giveawayManager.LoadGiveaways()
        } else {
        const embed = new EmbedBuilder()
        .setTitle("New giveaway")
        .setFooter({text: giveawayId})
        .setColor(Colors.Invisible)
        const selectMenu = new UserSelectMenuBuilder()
        .setMaxValues(winners!)
        .setMinValues(winners!)
        .setCustomId("giveawaySelectMenu")
        const row = new ActionRowBuilder().addComponents(selectMenu)
        
        
        //@ts-ignore
        await interaction.reply({embeds: [embed], components: [row], ephemeral: true})
        await giveawaySchema.create(giveawayObj)}
    }
}