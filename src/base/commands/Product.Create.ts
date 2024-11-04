import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import CustomClient from "../classes/CustomClient"
import SubCommand from "../classes/SubCommand"
import Colors from "../enums/Colors"
import productSchema from "../schemas/product"
import Emojis from '../enums/Emojis';

export default class ProductCreate extends SubCommand {
    constructor(client: CustomClient){
        super(client, {
            name: "product.create"
        })
    }

    async Execute(interaction: ChatInputCommandInteraction): Promise<void> {
        const name = interaction.options.getString("name")
        const description = interaction.options.getString("description")
        const statusImage = interaction.options.getString("status")
        const productImage = interaction.options.getString("image")
        const embed = new EmbedBuilder()
        .setTitle(name)
        .setDescription(`${description} \n ${Emojis.Divider}`)
        .setImage(productImage)
        .setColor(Colors.Invisible)
        .setThumbnail(statusImage)
        const channel = interaction.channel
        const button = new ButtonBuilder()
        .setLabel("Buy")
        .setCustomId("buyProduct")
        .setStyle(ButtonStyle.Success)
        .setEmoji(Emojis.BuyCart)
        const row = new ActionRowBuilder().addComponents(button)
        //@ts-ignore
        const msg = await channel?.send({embeds: [embed], components: [row]})
        productSchema.create({
            ProductName: name,
            ProductDescription: description,
            ProductStatusImage: statusImage,
            GuildID: interaction.guild!.id,
            ChannelID: channel!.id,
            MessageID: msg!.id
        })
        const embed2 = new EmbedBuilder()
        .setTitle("Product created successfully")
        .setDescription("Your product has been created successfully")
        .setColor(Colors.Success)
        //@ts-ignore
        await interaction.reply({embeds: [embed2], ephemeral: true})
    }
}