import { EmbedBuilder, Events, Message } from "discord.js";
import CustomClient from "../../classes/CustomClient";
import Event from "../../classes/Event";
import Colors from "../../enums/Colors";
import TicketCategory from "../../enums/TicketCategory";
export default class AutoLoader extends Event {
    constructor(client: CustomClient){
        super(client, {
            name: Events.MessageCreate,
            description: "Message create event",
            once: false

        })
    }
    async Execute(message: Message): Promise<void> {
        return
        //@ts-ignore
        if(message.channel.parent.id != TicketCategory.paypal && message.channel.parent.id != TicketCategory.giveawayclaim && message.channel.parent.id != TicketCategory.media && message.channel.parent.id != TicketCategory.buyingissue) return
        let loaderLink = ""
        if(true) return


        const embed = new EmbedBuilder()
        .setTitle("Loader")
        .setDescription(loaderLink)
        .setColor(Colors.Invisible)
        message.reply({embeds: [embed]})
    }
}