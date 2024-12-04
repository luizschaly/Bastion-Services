import { ChatInputCommandInteraction, EmbedBuilder, Message } from 'discord.js';
import CustomClient from "../classes/CustomClient"
import SubCommand from "../classes/SubCommand"
import Colors from "../enums/Colors"
import productSchema from "../schemas/product"
import Emojis from '../enums/Emojis';

export default class ProductEditProperty extends SubCommand {
    constructor(client: CustomClient){
        super(client, {
            name: "product.editproperty"
        })
    }

    async Execute(interaction: ChatInputCommandInteraction): Promise<void> {
        const product = interaction.options.getString("product")
        const property = interaction.options.getString("property")
        const propertyData = interaction.options.getString("propertyData")
        const productObj = await productSchema.findOne({GuildID: interaction.guild!.id, ProductName: product})
        const channel = await interaction.guild?.channels.fetch(productObj?.ChannelID!)
        //@ts-ignore
        const message: Message = await channel!.messages.fetch(productObj?.MessageID)
        const embed = EmbedBuilder.from(message.embeds[0])
        switch(property!){
            case "image":
                embed.setImage(propertyData)
                break;
            case "description":
                embed.setDescription(`${propertyData} \n ${Emojis.Divider}`)
                productObj!.ProductDescription! = propertyData!
                break;
            case "video":
                embed.setURL(propertyData)
                break;

        }
        await message.edit({embeds: [embed]})
        await productSchema.updateOne({GuildID:interaction.guild!.id, ProductName: product}, productObj!)
        const embed2 = new EmbedBuilder()
        .setTitle("Option edited successfully")
        .setDescription("Field has been edited successfully.")
        .setColor(Colors.Success)
        await interaction.reply({embeds: [embed2], ephemeral: true})
    }
}