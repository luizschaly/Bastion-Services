import { ActionRow, ActionRowBuilder, BaseGuildTextChannel, ButtonBuilder, ButtonInteraction, ButtonStyle, ChannelType, EmbedBuilder, Events, GuildScheduledEvent, GuildTextBasedChannel, inlineCode, PermissionFlagsBits, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from "discord.js";
import { createTranscript } from "discord-html-transcripts";
import CustomClient from "../../classes/CustomClient";
import ticketSchema from "../../schemas/ticket"
import Event from "../../classes/Event";
import Colors from "../../enums/Colors";
import giveawaySchema from "../../schemas/giveaway";
import Emojis from "../../enums/Emojis";
import Roles from "../../enums/Roles"
import productSchema from "../../schemas/product";
import cartSchema from "../../schemas/cart";
import TicketCategory from "../../enums/TicketCategory";
import fs from "fs"
import Channels from "../../enums/Channels";
import inviteSchema from "../../schemas/invite";
import guildSchema from "../../schemas/server";
export default class ButtonHandler extends Event {
    constructor(client: CustomClient) {
        super(client, {
            name: Events.InteractionCreate,
            description: "Button handler event",
            once: false

        })
    }
    async Execute(interaction: ButtonInteraction): Promise<void> {
        if (!interaction.isButton()) return
        switch (interaction.customId) {
            case "closeTicket": {
                const ticketObj = await ticketSchema.findOneAndDelete({ ChannelID: interaction.channel!.id })

                //@ts-ignore
                const user = await interaction.guild?.members.fetch(ticketObj.UserID)
                let transcriptFile
                if (ticketObj?.TicketType == "media") {
                    transcriptFile = await createTranscript(interaction.channel!, {
                        filename: `${user?.user.username}-media-ticket-transcript.html`,
                        poweredBy: false,
                    })

                } else {
                    transcriptFile = await createTranscript(interaction.channel!, {
                        filename: `ticket-${ticketObj?.TicketNum}-transcript.html`,
                        poweredBy: false,

                    })
                }
                const actionUser = interaction.user
                const cacheChannel = this.client.channels.cache.get("1298384221072789535") as BaseGuildTextChannel

                const cacheEmbed = new EmbedBuilder()
                    .setColor(Colors.Neutral)
                    .setDescription(`<:blurpledot:1290116382813323276> Ticket closed by: ${inlineCode(actionUser.username)}\n<:blurpledot:1290116382813323276> Ticket opened by: ${inlineCode(user!.user.username)}\n<:blurpledot:1290116382813323276> Transcript:`)
                if (ticketObj?.TicketType == "media") {
                    cacheEmbed.setTitle(`Media Ticket ${user?.user.username} Closed`)
                } else {
                    cacheEmbed.setTitle(`Ticket-${(ticketObj?.TicketNum!).toString().padStart(4, '0')} Closed`)
                }
                const cacheMsg = await cacheChannel!.send({ embeds: [cacheEmbed], files: [transcriptFile] })
                const openButton = new ButtonBuilder()
                    .setStyle(ButtonStyle.Link)
                    .setLabel("Open Transcript")
                    .setURL(`https://mahto.id/chat-exporter?url=${cacheMsg.attachments.first()?.url}`)
                cacheEmbed.setDescription(`<:blurpledot:1290116382813323276> Ticket closed by: ${inlineCode(actionUser.username)}\n<:blurpledot:1290116382813323276> Ticket opened by: ${inlineCode(user!.user.username)}\n<:blurpledot:1290116382813323276> Transcript: [transcript](${cacheMsg.attachments.first()?.url})`)
                const row = new ActionRowBuilder().addComponents(openButton)
                //@ts-ignore
                await user?.send({ embeds: [cacheEmbed], components: [row] })
                //@ts-ignore
                await cacheMsg.edit({ embeds: [cacheEmbed], components: [row] })
                await interaction.channel?.delete()
                break;
            }
            case "giveawayParticipate": {
                const embedData = interaction.message.embeds[0].data
                const giveawayObj = await giveawaySchema.findOne({ GuildID: interaction.guild!.id, GiveawayID: embedData.footer!.text })
                const participantsAmount = embedData.fields![0].value.replace(Emojis.BlurpleArrow, "")
                const newParticipantsAmount = parseInt(participantsAmount) + 1
                const embed2 = new EmbedBuilder()
                    .setTitle("Unable to join giveaway")
                    .setDescription("You are already participating in this giveaway")
                    .setColor(Colors.Error)
                //@ts-ignore
                if (giveawayObj?.participants.includes(interaction.user.id)) return await interaction.reply({ embeds: [embed2], ephemeral: true })

                embedData.fields![0].value = `${Emojis.BlurpleArrow} ${newParticipantsAmount}`
                await interaction.message.edit({ embeds: [embedData] })
                const embed = new EmbedBuilder()
                    .setTitle("Giveaway entry successfull")
                    .setDescription("You have successfully joined the giveaway, make sure to complete all the requirements to be eligible to receive the prize.")
                    .setColor(Colors.Success)
                //@ts-ignore
                if (giveawayObj!.participants.length == 0) {
                    giveawayObj!.participants = [interaction.user.id]
                } else giveawayObj!.participants.push(interaction.user.id)

                await interaction.reply({ embeds: [embed], ephemeral: true })
                await giveawaySchema.updateOne({ GuildID: interaction.guild!.id, GiveawayID: embedData.footer!.text }, giveawayObj!)
                break;
            }
            case "buyProduct": {
                const productObj = await productSchema.findOne({ GuildID: interaction.guild!.id, MessageID: interaction.message.id })
                const selectmenu = new StringSelectMenuBuilder()
                    .setMaxValues(1)
                    .setMinValues(1)
                    .setPlaceholder("Select plan")
                    .setCustomId(`selectProdOption${productObj?.ProductName}`)

                for (let i = 0; i < productObj?.ProductOptions.length; i++) {
                    selectmenu.addOptions(
                        new StringSelectMenuOptionBuilder()
                            .setLabel(productObj?.ProductOptions[i].Name)
                            .setValue(`${productObj?.ProductOptions[i].Name},${productObj?.ProductOptions[i].Price}`)
                            .setDescription(`$ ${productObj?.ProductOptions[i].Price},00`)
                            .setEmoji("📦")
                    )
                }
                const embed = new EmbedBuilder()
                    .setDescription(`# ${Emojis.BuyCart} Select plan`)
                    .setColor(Colors.Invisible)
                const row = new ActionRowBuilder()
                    .setComponents(selectmenu)
                //@ts-ignore
                await interaction.reply({ embeds: [embed], components: [row], ephemeral: true })
                break;
            }
            case "freeProduct": {
                let i = 0
                const userInvites = await inviteSchema.find({ GuildID: interaction.guild!.id, InviteCreator: interaction.user.id })
                console.log(userInvites)
                for (const invite of userInvites) {
                    i = + invite.RealUses!
                }

                if (interaction.message.embeds[0].title == "Ark: SE Dupe Method 1") {
                    if (i! < 5) {
                        const embed = new EmbedBuilder()
                            .setTitle("Not enough invites")
                            .setColor(Colors.Error)
                            .setDescription(`You still need to invite ${5 - i!} people to be able to get this free product, make sure they ${inlineCode("verify")} to the server or they will not count`)
                        await interaction.reply({ embeds: [embed], ephemeral: true })
                        return
                    }
                } else {
                    if (i! < 3) {
                        const embed = new EmbedBuilder()
                            .setTitle("Not enough invites")
                            .setColor(Colors.Error)
                            .setDescription(`You still need to invite ${3 - i!} people to be able to get this free product, make sure they ${inlineCode("verify")} to the server or they will not count`)
                        await interaction.reply({ embeds: [embed], ephemeral: true })
                        return
                    }
                }

                let productFile
                let tutorialString
                let descriptionString
                switch (interaction.message.embeds[0].title) {
                    case "Rust Logitech Script": {
                        productFile = "https://www.mediafire.com/file/mrxnq9req5jg8bp/logitechScript.txt/file"
                        tutorialString = "Make a new script and change the sensitivity to your current ingame."
                        descriptionString = `Click [here](${productFile}) to download \n\n ${tutorialString!}`
                        break
                    }
                    case "Valorant Triggerbot": {
                        tutorialString = ""
                        productFile = "https://www.mediafire.com/file/90blo9qp0l5bxpu/valorantTrigger.ahk/file"
                        descriptionString = `Click [here](${productFile}) to download \n\n ${tutorialString!}`
                        break
                    }
                    case "Ark: SE/SA Desync": {
                        tutorialString = "Download [netlimiter](https://download.netlimiter.com/nl/netlimiter-5.3.6.0.exe) V5.3.6 and netlimiterpatch, setup netlimiter then open netlimiterpatch.exe, then when it asks for path choose where your Local Disk is, then complete the following steps: \n\nWindows key -> Type Services \nClick any of them once and type N \nFind the Netlimiter Service \nRight click -> Stop \nClose the services window \nGo to your NetlimitePatch installation \nCopy the Netlimiter.dll file \nGo to your default Netlimiter installation \nPaste the file \nOpen your NetlimiterPatch exe and start the service where it says"
                        productFile = "https://www.mediafire.com/file/zl7fwg1hjdodxjy/NetLimiterPatch.exe/file"
                        descriptionString = `Click [here](${productFile}) to download \n\n ${tutorialString!}`
                        break
                    }
                    case "Ark: SE Dupe Method 1": {
                        tutorialString = "Download [process hacker](https://processhacker.sourceforge.io/)\nPlayer 1 : \ngrab items and travel to map 2 from map 1\nwhen on cloud suspend steam\nPlayer 2 : \ntry to enter map 2 and enter map 1\nwait on cloud\nPlayer 1 :\nspawn at map 1 and wait for player 2 to spawn at map 2\nafter player 2 spawns and stores items resume steam \nreopen ark and spawn at map 1\n  "
                        descriptionString = `${tutorialString!}`
                        break
                    }
                }
                const embed = new EmbedBuilder()
                    .setTitle(interaction.message.embeds[0].title)
                    .setDescription(descriptionString!)
                    .setColor(Colors.Invisible)
                await interaction.user.send({ embeds: [embed] })
                const embed2 = new EmbedBuilder()
                    .setTitle("Product sent")
                    .setDescription("Check your dms with the bot to use the free product.")
                    .setColor(Colors.Success)
                const embed3 = new EmbedBuilder()
                    .setColor(Colors.Invisible)
                    .setTitle(`${interaction.message.embeds[0].title} Claimed`)
                    .setDescription(`${interaction.user.displayName} has claimed a ${interaction.message.embeds[0].title}`)
                await interaction.reply({ embeds: [embed2], ephemeral: true })
                const channel = await interaction.guild?.channels.fetch(Channels.GetFreeProductLogs)
                //@ts-ignore
                channel!.send({ embeds: [embed3] })
                break
            }
            case "removeFCart": {
                const productEmbed = interaction.message.embeds[0]
                interaction.message.delete()
                const productOptionPrice = productEmbed.fields[0].value.replace(Emojis.BlurpleArrow, "").replace(Emojis.BlurpleDollar, "")
                const cartObj = await cartSchema.findOne({ GuildID: interaction.guild!.id, UserID: interaction.user.id })
                //@ts-ignore
                cartObj!.Products! = cartObj!.Products.filter(item => item.Name !== productEmbed.title);
                cartObj!.TotalPrice = - parseInt(productOptionPrice)
                //@ts-ignore
                await cartSchema?.updateOne({ GuildID: interaction.guild!.id, UserID: interaction.user.id }, cartObj)
                break
            }
            case "cartCheckout": {
                const userCartObj = await cartSchema.findOne({ GuildID: interaction.guild!.id, UserID: interaction.user.id })
                let descString = ""
                for (const product of userCartObj?.Products!) {
                    if (product.Api !== "None") {
                        return
                    }
                    descString += `> ${product.Name} ${product.PlanOption} - ${product.PlanOptionPrice} ${Emojis.BlurpleDollar}\n`
                }
                const embed = new EmbedBuilder()
                    .setDescription(`# ${interaction.user.displayName} Cart \n> **Final Price:** \n ${Emojis.BlurpleArrow} ${userCartObj?.TotalPrice}${Emojis.BlurpleDollar} \n\n${Emojis.BlurpleDot}**Products:** \n${descString}`)
                    .setColor(Colors.Invisible)
                const guildObj = await guildSchema.findOne({ GuildID: interaction.guild!.id })
                const newTicketNum = parseInt(guildObj!.LastTicketNum!) + 1
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
                for (const key in Roles) {
                    //@ts-ignore
                    permissions.push({ id: Roles[key], allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] })
                }
                //@ts-ignore
                const ticketCategoryID = TicketCategory["purchase"] as string;
                const ticketChannel = await interaction.guild?.channels.create({
                    parent: ticketCategoryID,
                    name: `ticket ${(newTicketNum).toString().padStart(4, '0')}`,
                    type: ChannelType.GuildText,
                    permissionOverwrites: permissions,
                });
                const ticketConfigEmbed = new EmbedBuilder()
                    .setColor(Colors.Invisible)
                    .setDescription(`# **Ticket-${newTicketNum.toString().padStart(4, '0')}**\n`+"<:blurpledot:1290116382813323276> Staff will be with you shortly\n<:blurpledot:1290116382813323276> To close this ticket click on the <:blurplelock:1298368181169160194> button")
                const button2 = new ButtonBuilder()
                    .setLabel("Close ticket")
                    .setCustomId("closeTicket")
                    .setEmoji("<:blurplelock:1298368181169160194>")
                    .setStyle(ButtonStyle.Secondary)
                
                const row2 = new ActionRowBuilder().addComponents(button2)
                //@ts-ignore
                ticketChannel!.send({embeds: [ticketConfigEmbed], components: [row2]})
                //@ts-ignore
                ticketChannel!.send({content: `<@${interaction.user.id}> <@&${Roles.Founder}> <@&${Roles.Support}> <@&${Roles.Admin}>`, embeds: [embed]})
                //@ts-ignore
                interaction.channel!.delete()
                await guildSchema.findOneAndUpdate({LastTicketNum: newTicketNum})
                await ticketSchema.create({TicketType: "purchase", GuildID: interaction.guild?.id, UserID: interaction.user.id, TicketNum: newTicketNum, ChannelID: ticketChannel!.id })
                await cartSchema?.deleteOne({ GuildID: interaction.guild!.id, UserID: interaction.user.id })
                break
            }

        }
    }
}