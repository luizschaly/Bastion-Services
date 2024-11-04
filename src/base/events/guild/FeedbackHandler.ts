import { Embed, EmbedBuilder, Events, Message } from "discord.js";
import CustomClient from "../../classes/CustomClient";
import Event from "../../classes/Event";
import Emojis from "../../enums/Emojis";
import Colors from "../../enums/Colors";
export default class CommandHandler extends Event {
    constructor(client: CustomClient){
        super(client, {
            name: Events.MessageCreate,
            description: "Message create event",
            once: false

        })
    }
    async Execute(message: Message): Promise<void> {
        if(message.channelId != this.client.config.logChannels.feedback) return
        if(!message.author.bot) return
        if(message.author.id == this.client.user!.id) return

        const embed = message.embeds[0] as Embed
        const embedData = embed.data
        const feedback = embedData.fields![1].value
        const starAmmount = parseInt(embedData.fields![2].value.replace("/5", ""))
        let starstring = ""
        for(let i = 0; i < starAmmount; i++){
            starstring += "<:blurplestar:1299461891583774730>" 
        }
        const embed2 = new EmbedBuilder()
        .setTitle("New review on website.")
        .setURL(embedData.url!)
        .setDescription(feedback)
        .setColor(Colors.Invisible)
        .addFields({name: ` ${Emojis.BlurpleDot} Rating`, value: `${Emojis.BlurpleArrow} ${starstring}`})

        await message.channel.send({embeds:[embed2]})
        message.delete()
    }
}