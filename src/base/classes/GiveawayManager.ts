import CustomClient from "./CustomClient";
import IGiveawayManager from "../interfaces/IGiveawayManager";
import giveawaySchema from "../schemas/giveaway";
import IGiveaway from "../interfaces/IGiveaway";
import { EmbedBuilder, Message } from "discord.js";
import Emojis from "../enums/Emojis";
import Colors from "../enums/Colors";

export default class GiveawayManager implements IGiveawayManager {
    client: CustomClient;
    constructor(client: CustomClient){
        this.client = client
    }
    async LoadGiveaways(): Promise<void> {
        const giveaways = await giveawaySchema.find() as IGiveaway[]
        for(const giveaway of giveaways!){
            setTimeout(async () =>{
            const giveAwayUpdated = await giveawaySchema.findOne({GiveawayID: giveaway.GiveawayID})
            const channel = await this.client.channels.fetch(giveAwayUpdated!.ChannelID!) 
            //@ts-ignore
            const message = await channel!.messages.fetch(giveAwayUpdated.MessageID) as Message

            let winnersArray = []
            if(giveAwayUpdated!.setWinners){
                winnersArray = giveAwayUpdated!.winners!
            } else {
                for(let i = 0; i< giveAwayUpdated!.winnersAmount!; i++){
                    const winner = giveAwayUpdated!.participants![Math.floor(Math.random() * giveAwayUpdated!.participants!.length)]
                    winnersArray.push(winner)
                }

            }
            winnersArray = winnersArray.map(id => `<@${id}>`)
            const winnersText = winnersArray.join(", ")
            const embed = new EmbedBuilder()
            .setTitle("Congratulations to winners")
            .setDescription("Make a giveaway claim ticket to receive your prize, if you didnt complete the requirements your prize will be rerolled.")
            .setColor(Colors.Invisible)
            const embedData = message.embeds[0].data
            embedData.fields![1].name = `${Emojis.BlurpleDot} Ended`
            await message.edit({embeds: [embedData], components: []})
            await message.reply({content: winnersText ,embeds: [embed]})
            await giveawaySchema.deleteOne({GiveawayID: giveAwayUpdated!.GiveawayID})
        }
        ,giveaway.duration * 1000)
        }
        console.log("Giveaways loaded")
    }
}