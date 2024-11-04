import { Embed, EmbedBuilder, Events, Message } from "discord.js";
import CustomClient from "../../classes/CustomClient";
import Event from "../../classes/Event";
import Colors from "../../enums/Colors";
export default class BuyOrderHandler extends Event {
    constructor(client: CustomClient){
        super(client, {
            name: Events.MessageCreate,
            description: "Message create event",
            once: false

        })
    }
    async Execute(message: Message): Promise<void> {
        
        if(message.channelId != this.client.config.logChannels.buyLogs) return
        if(!message.author.bot) return
        if(message.author.id == this.client.user!.id) return

        const embed = message.embeds[0] as Embed
        const embedData = embed.data
        const invoiceIdInput = embedData.fields![0].value

        let invoiceId = invoiceIdInput.includes('-') ? invoiceIdInput.split('-').pop() : invoiceIdInput;
        invoiceId = invoiceId!.replace(/^0+/, '');

        const shopApiKey = this.client.config.sellAuth.shopApiKey
        const shopId = this.client.config.sellAuth.shopId
        const apiUrl = `https://api.sellauth.com/v1/shops/${shopId}/invoices/${invoiceId}`;

        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${shopApiKey}` }
        });
        const invoiceData = await response.json()
        const embedFields = embedData.fields!
        const embed2 = new EmbedBuilder()
        .setTitle(embedData.title!)
        .setURL(embedData.url!)
        .setColor(Colors.Invisible)
        .addFields(
            {
                name: "Order Id",
                value: embedFields[0].value,
                inline: true
            },
            {
                name: "Product",
                value: embedFields[1].value,
                inline: true
            },
            
            {
                name: "Price",
                value: embedFields[2].value,
                inline: true
            },
            {
                name: "Gateway",
                value: embedFields[3].value,
                inline: true
            },
            {
                name: "Email",
                value: embedFields[4].value,
                inline: true
            },
            {
                name: "Discord",
                value: embedFields[5].value,
                inline: true
            },
            {
                name: "Buyers Ip",
                value: invoiceData.ip,
                inline: true
            },
            
    )
    if(invoiceData.variant){
        embed2.addFields({
            name: "Type",
            value: invoiceData.variant,
            inline: true
        })
    }
    await message.channel.send({embeds: [embed2]})
    message.delete()
    
    }
}