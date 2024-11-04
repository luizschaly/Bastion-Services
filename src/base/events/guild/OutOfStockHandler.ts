import { Embed, EmbedBuilder, Events, Message } from "discord.js";
import CustomClient from "../../classes/CustomClient";
import Event from "../../classes/Event";
import Colors from "../../enums/Colors";
export default class OutOfStockHandler extends Event {
    constructor(client: CustomClient){
        super(client, {
            name: Events.MessageCreate,
            description: "Message create event",
            once: false

        })
    }
    async Execute(message: Message): Promise<void> {
        if(message.channelId != this.client.config.logChannels.outOfStock) return
        if(!message.author.bot) return
        if(message.author.id == this.client.user!.id) return

        const embed = message.embeds[0] as Embed
        const embedData = embed.data
        const productName = embedData.fields![0].value
        const embed2 = new EmbedBuilder()
        .setTitle(`${productName} has run out of stock.`)
        .setURL(embedData.url!)
        .setColor(Colors.Invisible)
        await message.channel.send({embeds:[embed2]})
        message.delete()
    }
}