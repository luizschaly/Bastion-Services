import { EmbedBuilder, Events, Message } from "discord.js";
import CustomClient from "../../classes/CustomClient";
import Event from "../../classes/Event";
import Colors from "../../enums/Colors";
export default class StickyMessageHandler extends Event {
    constructor(client: CustomClient){
        super(client, {
            name: Events.MessageCreate,
            description: "Message create event",
            once: false

        })
    }
    async Execute(message: Message): Promise<void> {
        if(message.channel.id !== "1299501751967420458") return 
        if(message.author.bot) return

        const messages = await message.channel.messages.fetch({ limit: 20 })
        const botMessage = messages.find((msg: Message) => msg.author.id === this.client.user!.id )
        if(botMessage)botMessage?.delete()
        const embed = new EmbedBuilder()
        .setTitle("How to get customer role?")
        .setDescription("After you bought your product, retrieve the invoice id and the email you used to purchase and run the command </claim:1298802284809027644>")
        .setColor(Colors.Invisible)
        //@ts-ignore
        await message.channel.send({embeds: [embed]})
    }
    
}