import { ActionRowBuilder, ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits, PermissionsBitField, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from "discord.js";
import CustomClient from "../classes/CustomClient";
import SubCommand from "../classes/SubCommand";
import Emojis from "../enums/Emojis";
import Colors from "../enums/Colors";
import Category from "../enums/Category";

export default class ServerMessageTicketDisplay extends SubCommand {
    constructor(client: CustomClient){
        super(client, {
            name: "servermessage.ticketdisplay"
        })
    }

    async Execute(interaction: ChatInputCommandInteraction) {
        const channel = interaction.channel!;
        const embed = new EmbedBuilder()
          .setTitle("Support Ticket")
          .setDescription(
            `Only make a ticket for one the following reasons:\n\n${Emojis.BlurpleDot} Purchase a Product\n${Emojis.BlurpleDot} Media application\n${Emojis.BlurpleDot} Paypal payment\n${Emojis.BlurpleDot} Chair setup problem\n${Emojis.BlurpleDot} Buying problems\n${Emojis.BlurpleDot} Giveaway Claim`
          )
          .setColor(Colors.Invisible)
          .setImage("https://i.imgur.com/nPUume1.png");
        const selectmenu = new StringSelectMenuBuilder()
          .setCustomId("createTicket")
          .setPlaceholder("Make a ticket...")
          .setMaxValues(1)
          .setMinValues(1)
          .setOptions(
            new StringSelectMenuOptionBuilder()
              .setLabel("Purchase Ticket")
              .setDescription("Click here to purchase.")
              .setValue("purchase")
              .setEmoji("<:blurpledollar:1290115065558601769>"),
            new StringSelectMenuOptionBuilder()
              .setLabel("Giveaway Claim")
              .setDescription("Click here to claim a giveaway.")
              .setValue("giveawayclaim")
              .setEmoji("<:blurpleannouncement:1299582203977797653>"),
            new StringSelectMenuOptionBuilder()
              .setLabel("Media Ticket")
              .setDescription("Click here to open a media application.")
              .setValue("media")
              .setEmoji("<:blurplecamera:1297644904012320903>"),
            new StringSelectMenuOptionBuilder()
              .setLabel("Paypal Ticket")
              .setDescription("Click here to open a paypal ticket.")
              .setValue("paypal")
              .setEmoji("<:blurplepaypal:1297758009245565048>"),
            new StringSelectMenuOptionBuilder()
              .setLabel("Buying Issue Ticket")
              .setDescription("Click here to open a buying issue ticket.")
              .setValue("buyingissue")
              .setEmoji("<:blurpledollar:1290115065558601769>"),
            new StringSelectMenuOptionBuilder()
              .setLabel("Setup Issue Ticket")
              .setDescription("Click here to open a setup issue ticket.")
              .setValue("setupissue")
              .setEmoji("<:blurplegear:1297639429271195809>")
          );
        const row: any = new ActionRowBuilder().addComponents(selectmenu)
        //@ts-ignore
        channel.send({ embeds: [embed], components: [row] });
    }
}