import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, Events, UserSelectMenuInteraction, Message } from 'discord.js';
import CustomClient from "../../classes/CustomClient";
import Event from "../../classes/Event";
import giveawaySchema from "../../schemas/giveaway"
import Emojis from '../../enums/Emojis';
import Colors from '../../enums/Colors';
export default class CommandHandler extends Event {
    constructor(client: CustomClient){
        super(client, {
            name: Events.InteractionCreate,
            description: "UserSelectMenu handler event",
            once: false

        })
    }
    async Execute(interaction: UserSelectMenuInteraction): Promise<void> {
        if(!interaction.isUserSelectMenu()) return
        const embedData = interaction.message.embeds[0].data
        const giveawayObj = await giveawaySchema.findOne({GuildID:interaction.guild!.id, GiveawayID: embedData.footer!.text})

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
        giveawayObj!.winners = interaction.values

        await giveawaySchema.findOneAndUpdate({GuildID:giveawayObj!.GuildID, GiveawayID: giveawayObj!.GiveawayID }, giveawayObj!)
        this.client.giveawayManager.LoadGiveaways()
    }
    
}