import { ActionRow, ActionRowBuilder, ChatInputCommandInteraction, EmbedBuilder, ModalActionRowComponentBuilder, ModalBuilder, PermissionsBitField, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from "discord.js"
import Command from "../classes/Command"
import CustomClient from "../classes/CustomClient"
import Category from "../enums/Category"
import Emojis from "../enums/Emojis"
import Colors from "../enums/Colors"
import Loaders from "../enums/Loaders"

export default class ServerMessageLoadersMessage extends Command {
    constructor(client: CustomClient){
        super(client, {
            name: "servermessage.loadersmessage",
            description: "Sends the get loaders message.",
            category: Category.SellAuth,
            default_member_permissions: PermissionsBitField.Flags.Administrator,
            dm_permission: false,
            options: []
        })
    
    } 
    async Execute(interaction: ChatInputCommandInteraction) {
       const embed = new EmbedBuilder()
       .setTitle("Get Loader")
       .setColor(Colors.Invisible)
       .setImage("https://i.imgur.com/Dt8l6aM.png")
       .setDescription("Before getting the loader make sure to complete all steps [here](https://loader-instructions.gitbook.io/loader-instructions/)\nSelect the product to get the loader you want.")
       const selectmenu = new StringSelectMenuBuilder()
       .setMaxValues(1)
       .setMinValues(1)
       .setPlaceholder("Select loader...")
       .setCustomId("getLoader")
       for(const key in Loaders){
        selectmenu.addOptions(
            new StringSelectMenuOptionBuilder()
            .setLabel(key.replace("_", " "))
            .setDescription(`Get ${key.replace("_", " ")}'s loader.`)
            .setEmoji(Emojis.BlurpleDot)
            .setValue(key)
        )
       }
       const row = new ActionRowBuilder()
       .setComponents(selectmenu)
       //@ts-ignore
        interaction.channel?.send({embeds: [embed], components: [row]})
    }
}