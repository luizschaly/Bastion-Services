import {EmbedBuilder, Events, ModalSubmitInteraction, ChannelType, PermissionFlagsBits, ButtonStyle, ButtonBuilder, ActionRowBuilder } from "discord.js";
import CustomClient from "../../classes/CustomClient";
import Colors from "../../enums/Colors";
import Event from "../../classes/Event";
import ticketSchema from "../../schemas/ticket";
import serverSchema from "../../schemas/server";
import claimSchema from "../../schemas/claim";
import Roles from "../../enums/Roles";
import TicketCategory from "../../enums/TicketCategory";
export default class ModalHandler extends Event {
    constructor(client: CustomClient){
        super(client, {
            name: Events.InteractionCreate,
            description: "Modal handler event",
            once: false

        })
    }
    async Execute(interaction: ModalSubmitInteraction): Promise<void> {
        if(!interaction.isModalSubmit()) return
        switch(interaction.customId){
            case "mediaTicket": {
                const youtubeResult = interaction.fields.getTextInputValue("youtubeInput")
                const viewsResult = interaction.fields.getTextInputValue("viewsInput")
                const paymentResult = interaction.fields.getTextInputValue("paymentInput")
                const embed = new EmbedBuilder()
                .setColor(Colors.Neutral)
                .setTitle(`${interaction.user.username} Media Ticket`)
                .addFields([{name: `<:blurpledot:1290116382813323276> Whats your youtube?`, value: `<:brarrow:1290116111672803421> ${youtubeResult}`}, {name: `<:blurpledot:1290116382813323276> Whats your average view count?`, value: `<:brarrow:1290116111672803421> ${viewsResult}`}, {name: `<:blurpledot:1290116382813323276> Do you have any payment expectations?`, value: `<:brarrow:1290116111672803421> ${paymentResult}`}])
                const permissions = [
                    {
                      id: interaction.user.id,
                      allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
                    },
                    {
                      id: "1290345221325852714",
                      deny: [PermissionFlagsBits.ViewChannel],
                    },
                    {
                        id: interaction.guild!.roles.everyone.id,
                        deny: [PermissionFlagsBits.ViewChannel],
                    },
                  ]
                  for(const key in Roles){
                    //@ts-ignore
                    permissions.push({id: Roles[key], allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages]})
                  }
                const mediaCategoryID = TicketCategory.media
                const ticketChannel = await interaction.guild?.channels.create({
                    parent: mediaCategoryID,
                    name: `${interaction.user.username} media`,
                    type: ChannelType.GuildText,
                    permissionOverwrites: permissions
                  });
                  const embed2 = new EmbedBuilder()
                .setColor(Colors.Success)
                .setTitle("Ticket created successfully")
                .setDescription(`Your [ticket](https://discord.com/channels/${interaction.guild!.id}/${ticketChannel!.id}) has been successfully created`)
                .setImage("https://i.imgur.com/nPUume1.png")


                const button = new ButtonBuilder()
                .setStyle(ButtonStyle.Link)
                .setLabel("Go to ticket")
                .setURL(`https://discord.com/channels/${interaction.guild!.id}/${ticketChannel!.id}`)

                const embed3 = new EmbedBuilder()
                .setTitle("Media ticket")
                .setColor(Colors.Neutral)
                .setDescription("<:blurpledot:1290116382813323276> Staff will be with you shortly\n<:blurpledot:1290116382813323276> To close this ticket click on the <:blurplelock:1298368181169160194> button")
                const row = new ActionRowBuilder().addComponents(button)
                const button2 = new ButtonBuilder()
                .setLabel("Close ticket")
                .setCustomId("closeTicket")
                .setEmoji("<:blurplelock:1298368181169160194>")
                .setStyle(ButtonStyle.Secondary)
                const row2 = new ActionRowBuilder().addComponents(button2)
                //@ts-ignore
                await ticketChannel?.send({embeds: [embed3], components: [row2]})
                await ticketChannel?.send({embeds: [embed]})
                //@ts-ignore
                await interaction.reply({embeds: [embed2], components: [row], ephemeral :true})
                await ticketSchema.create({GuildID: interaction.guild?.id, UserID: interaction.user.id, ChannelID: ticketChannel?.id, TicketType: "media"})
                break;
              }
            case "customerRoleModal": {
              let guildData = await serverSchema.findOne({GuildID: interaction.guild!.id})
        if(!guildData){
            guildData = await serverSchema.create({GuildID: interaction.guild!.id})
        }
        const customerRoleID = guildData!.CustomerRole
        let claimsData = await claimSchema.findOne({GuildID: interaction.guild!.id})
        if(!claimsData){
            //@ts-ignore
            claimsData = claimSchema.create({GuildID: interaction.guild!.id, Claims: {}})
        }
        const invoiceIdInput = interaction.fields.getTextInputValue("invoiceId")
        const email = interaction.fields.getTextInputValue("email")

        let invoiceId = invoiceIdInput.includes('-') ? invoiceIdInput.split('-').pop() : invoiceIdInput;
        invoiceId = invoiceId!.replace(/^0+/, '');
        //@ts-ignore
        if (claimsData[invoiceId]) {

            const embed = new EmbedBuilder()
            .setTitle("Customer role already claimed")
            .setDescription(`Customer role has already been claimed via invoice ${invoiceId}.`)
            await interaction.reply({embeds: [embed], ephemeral: true})
            return;
        }
        const shopApiKey = this.client.config.sellAuth.shopApiKey
        const shopId = this.client.config.sellAuth.shopId
        const apiUrl = `https://api.sellauth.com/v1/shops/${shopId}/invoices/${invoiceId}`;

        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${shopApiKey}` }
        });
        if (response.status === 200) {
            const invoiceData = await response.json();

            // Compare provided email with invoice email
            if (invoiceData.email !== email) {
                const embed = new EmbedBuilder()
                .setTitle("Emails doesnt match")
                .setDescription("The provided email does not match the invoice's email.")
                .setColor(Colors.Error)
                await interaction.reply({embeds: [embed], ephemeral: true})
                return;
            }

            if (invoiceData.completed_at) {
                const customerRole = interaction.guild!.roles.cache.get(customerRoleID!);
                if (customerRole) {
                    //@ts-ignore
                    await interaction.member!.roles.add(customerRole);
                }

                //@ts-ignore
                claimsData![invoiceId] = interaction.user.id;
                claimSchema.findOneAndUpdate({GuildID: interaction.guild!.id}, claimsData!)
                const embed = new EmbedBuilder()
                .setTitle("Customer role claimed successfully")
                .setDescription(`Customer role claimed successfully via invoice ${invoiceId}.`)
                .setColor(Colors.Success)
                await interaction.reply({embeds: [embed], ephemeral: true})

                } else {
                const embed = new EmbedBuilder()
                .setTitle("Invoice has not been paid yet")
                .setDescription(`The invoice ${invoiceId} has not been paid yet`)
                .setColor(Colors.Error)
                await interaction.reply({embeds: [embed], ephemeral: true})
            }
        } else {
            const embed = new EmbedBuilder()
            .setTitle("Error when claiming role")
            .setDescription("There was an unknown error while claiming the customer role. Please try again later.")
            .setColor(Colors.Error)
            await interaction.reply({embeds: [embed], ephemeral: true})
        }
            break;
      }
        }

    }
    
}