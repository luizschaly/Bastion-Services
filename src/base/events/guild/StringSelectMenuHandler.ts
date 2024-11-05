import {
    ActionRow,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChannelType,
  EmbedBuilder,
  Events,
  Message,
  ModalActionRowComponentBuilder,
  ModalBuilder,
  PermissionFlagsBits,
  StringSelectMenuInteraction,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";
import CustomClient from "../../classes/CustomClient";
import Event from "../../classes/Event";
import TicketCategory from "../../enums/TicketCategory";
import TicketCategoryImage from "../../enums/TicketCategoryImage";
import Colors from "../../enums/Colors";
import guildSchema from "../../schemas/server"
import Emojis from "../../enums/Emojis";
import ticketSchema from "../../schemas/ticket";
import productSchema from "../../schemas/product";
import cartSchema from "../../schemas/cart";
import IProductOption from "../../interfaces/IProductOption";
import Loaders from "../../enums/Loaders";

export default class SelectMenuHandler extends Event {
  constructor(client: CustomClient) {
    super(client, {
      name: Events.InteractionCreate,
      description: "SelectMenu handler event",
      once: false,
    });
  }
  async Execute(interaction: StringSelectMenuInteraction): Promise<void> {
    if (!interaction.isStringSelectMenu()) return;
    switch (interaction.customId) {
      case "createTicket": {
        const ticketType = interaction.values[0].toLowerCase()
        if(ticketType == "media"){
            const youtubeInput = new TextInputBuilder()
            .setCustomId("youtubeInput")
            .setStyle(TextInputStyle.Short)
            .setLabel("Whats your youtube?")
            .setRequired(true)
            const viewsInput = new TextInputBuilder()
            .setCustomId("viewsInput")
            .setStyle(TextInputStyle.Short)
            .setLabel("Whats your average view count?")
            .setRequired(true)
            const paymentInput = new TextInputBuilder()
            .setCustomId("paymentInput")
            .setStyle(TextInputStyle.Short)
            .setLabel("Do you have any payment expectations?")
            .setRequired(true)

            const youtubeInputRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(youtubeInput)
            const viewsInputRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(viewsInput)
            const paymentInputRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(paymentInput)

            const modal = new ModalBuilder()
            .setTitle("Media Application")
            .setCustomId("mediaTicket")
            .setComponents(youtubeInputRow, viewsInputRow, paymentInputRow)

            return await interaction.showModal(modal)
        }
        let guildObj = await guildSchema.findOne({GuildID: interaction.guild!.id})
        if(!guildObj) {
            guildObj = await guildSchema.create({GuildID: interaction.guild!.id, LastTicketNum: "0"})
        }
        const newTicketNum = parseInt(guildObj.LastTicketNum!) + 1
        //@ts-ignore
        const ticketCategoryID = TicketCategory[ticketType] as string;
        const ticketChannel = await interaction.guild?.channels.create({
          parent: ticketCategoryID,
          name: `ticket ${(newTicketNum).toString().padStart(4, '0')}`,
          type: ChannelType.GuildText,
          permissionOverwrites: [
            {
              id: interaction.user.id,
              allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
            },
          ],
        });
        const embed = new EmbedBuilder()
        .setColor(Colors.Success)
        .setTitle("Ticket created successfully")
        .setDescription(`Your [ticket](https://discord.com/channels/${interaction.guild!.id}/${ticketChannel!.id}) has been successfully created`)
        .setImage("https://i.imgur.com/nPUume1.png")


        const button = new ButtonBuilder()
        .setStyle(ButtonStyle.Link)
        .setLabel("Go to ticket")
        .setURL(`https://discord.com/channels/${interaction.guild!.id}/${ticketChannel!.id}`)

        const row = new ActionRowBuilder().addComponents(button)

        const ticketEmbed = new EmbedBuilder()
        .setTitle(`Ticket-${(newTicketNum).toString().padStart(4, '0')}`)
        //@ts-ignore
        .setImage(TicketCategoryImage[ticketType])
        .setDescription("<:blurpledot:1290116382813323276> Provide the staff with the necessary information for your ticket.")
        .setColor(Colors.Invisible)
        const ticketConfigEmbed = new EmbedBuilder()
        .setTitle(`Ticket-${newTicketNum.toString().padStart(4, '0')}`)
        .setColor(Colors.Invisible)
        .setDescription("<:blurpledot:1290116382813323276> Staff will be with you shortly\n<:blurpledot:1290116382813323276> To close this ticket click on the <:blurplelock:1298368181169160194> button")
        const button2 = new ButtonBuilder()
        .setLabel("Close ticket")
        .setCustomId("closeTicket")
        .setEmoji("<:blurplelock:1298368181169160194>")
        .setStyle(ButtonStyle.Secondary)

        const row2 = new ActionRowBuilder().addComponents(button2)
        //@ts-ignore
        await ticketChannel?.send({embeds: [ticketEmbed, ticketConfigEmbed], components: [row2]})
        //@ts-ignore
        await interaction.reply({embeds: [embed], components: [row], ephemeral: true})
        await guildSchema.findOneAndUpdate({LastTicketNum: newTicketNum})
        await ticketSchema.create({TicketType: ticketType, GuildID: interaction.guild?.id, UserID: interaction.user.id, TicketNum: newTicketNum, ChannelID: ticketChannel!.id })
        break;
      }
      case "getLoader": {
        const game = interaction.values[0]
        const gameLabel = game.replace("_", " ")
        const embed = new EmbedBuilder()
        .setTitle(`${gameLabel}'s Loader`)
        .setColor(Colors.Invisible)
        .setDescription("Before getting the loader make sure to complete all steps [here](https://loader-instructions.gitbook.io/loader-instructions/)")
        .addFields({
          name: `${Emojis.BlurpleDot}Loader Download`,
          value: `${Emojis.BlurpleArrow} [Download](${Loaders[game].loader})`
        },
        {
          name: `${Emojis.BlurpleDot}Instructions`,
          value: `${Emojis.BlurpleArrow} [Instructions](${Loaders[game].instructions})`
        }
        )
        const embed2 = new EmbedBuilder()
        .setTitle("Loader sent successfully")
        .setDescription("Check your dms with the bot to get the loader download and instructions")
        .setColor(Colors.Success)
        interaction.user.send({embeds: [embed]})
        interaction.reply({embeds: [embed2], ephemeral: true})
        break;
      }
    }
    if(interaction.customId.includes("selectProdOption")){
      const productName = interaction.customId.replace("selectProdOption", "")
      const productObj = await productSchema.findOne({GuildID: interaction.guild!.id, ProductName: productName})

      const channel = await interaction.guild?.channels.fetch(productObj?.ChannelID!)
      //@ts-ignore
      const msg: Message = await channel!.messages.fetch(productObj?.MessageID)
      const embed = msg.embeds[0]
      const [plan, price] = interaction.values[0].split(",");
      const productEmbed = new EmbedBuilder()
      .setTitle(embed.title)
      .setImage(embed.image?.url!)
      .addFields({
        name: `${Emojis.BlurpleDot}${plan}`,
        value: `${Emojis.BlurpleArrow}${price}${Emojis.BlurpleDollar}`
      })
      const initialembed = new EmbedBuilder()
      .setTitle(`${interaction.user.username} Cart`)
      .setDescription("The products in your cart will be displayed in this channel")
      .setColor(Colors.Invisible)
      const userCartCategory = await interaction.guild?.channels.fetch(TicketCategory.cart)
      let usercart = await cartSchema.findOne({GuildID: interaction.guild!.id, UserID: interaction.user.id})
      //@ts-ignore
      let userCartChannel = interaction.guild?.channels.cache.get((channel) => channel.parentId === userCartCategory.id && channel.name === interaction.user.username)
      if(!usercart){ 
          //@ts-ignore
          userCartChannel = await interaction.guild?.channels.create({
              //@ts-ignore
              parent: userCartCategory,
              name: interaction.user.username,
              type: ChannelType.GuildText,
              permissionOverwrites: [
                {
                  id: interaction.user.id,
                  allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
                },
                {
                  id: interaction.guild.roles.everyone.id,
                  deny: [PermissionFlagsBits.ViewChannel],
                },
              ],
            });
          const button = new ButtonBuilder()
          .setLabel("Checkout")
          .setCustomId("cartCheckout")
          .setStyle(ButtonStyle.Success)
          .setEmoji(Emojis.BuyCart)
          const row = new ActionRowBuilder()
          .setComponents(button)
          //@ts-ignore
          userCartChannel.send({embeds: [initialembed], components: [row]})
          usercart = await cartSchema.create({GuildID: interaction.guild!.id, UserID: interaction.user.id})
      }
      const button = new ButtonBuilder()
      .setLabel("Remove")
      .setCustomId("removeFCart")
      .setStyle(ButtonStyle.Danger)
      const row = new ActionRowBuilder()
      .setComponents(button)
      //@ts-ignore
      await userCartChannel.send({embeds: [productEmbed], components: [row]})
      const apiIndex = productObj?.ProductOptions.findIndex((obj: IProductOption) => obj.Name == plan)
      usercart.Products.push({Name: productObj!.ProductName!, Api: productObj?.ProductOptions[apiIndex].API})
      usercart.TotalPrice! += parseInt(price)
      const responseEmbed = new EmbedBuilder()
      .setTitle("Product Added")
      .setDescription("The product has been added to your cart successfully")
      .setColor(Colors.Success)
      const linkbutton = new ButtonBuilder()
      .setLabel("Go to cart")
      .setStyle(ButtonStyle.Link)
      .setURL(userCartChannel!.url)
      const linkRow = new ActionRowBuilder().addComponents(linkbutton)
      //@ts-ignore
      await interaction.reply({embeds: [responseEmbed],components: [linkRow], ephemeral: true})
      await cartSchema.updateOne({GuildID: interaction.guild?.id, UserID: interaction.user.id}, usercart)
    }
  }
}
