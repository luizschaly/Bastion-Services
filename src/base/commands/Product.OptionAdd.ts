import { ChatInputCommandInteraction, EmbedBuilder, Message } from 'discord.js';
import CustomClient from "../classes/CustomClient"
import SubCommand from "../classes/SubCommand"
import Colors from "../enums/Colors"
import productSchema from "../schemas/product"
import Emojis from '../enums/Emojis';

export default class ProductOptionAdd extends SubCommand {
    constructor(client: CustomClient){
        super(client, {
            name: "product.optionadd"
        })
    }

    async Execute(interaction: ChatInputCommandInteraction): Promise<void> {
        const product = interaction.options.getString("product")
        const productObj = await productSchema.findOne({GuildID: interaction.guild!.id, ProductName: product})
        const channel = await interaction.guild?.channels.fetch(productObj?.ChannelID!)
        const name = interaction.options.getString("name")
        const value = interaction.options.getNumber("value")
        let api = interaction.options.getString("api")
        if(!api) api = "None"
        //@ts-ignore
        const message: Message = await channel!.messages.fetch(productObj?.MessageID)
        const embed = EmbedBuilder.from(message.embeds[0]).addFields({name: `${Emojis.BlurpleDot}${name}`, value: `${Emojis.BlurpleArrow} ${value}${Emojis.BlurpleDollar}`})
        await message.edit({embeds: [embed]})
        if(!productObj?.ProductOptions){
            productObj!.ProductOptions = [{Name: name, Price: value, API: api}]
        } else productObj?.ProductOptions.push({Name: name, Price: value, API: api})
        await productSchema.updateOne({GuildID:interaction.guild!.id, ProductName: product}, productObj!)
        const embed2 = new EmbedBuilder()
        .setTitle("Option added successfully")
        .setDescription("Your product option has been added successfully")
        .setColor(Colors.Success)
        await interaction.reply({embeds: [embed2], ephemeral: true})
    }
}