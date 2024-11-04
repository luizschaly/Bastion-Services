import { ChatInputCommandInteraction, Events } from "discord.js";
import CustomClient from "../../classes/CustomClient";
import Event from "../../classes/Event";
import Command from "../../classes/Command";
export default class CommandHandler extends Event {
    constructor(client: CustomClient){
        super(client, {
            name: Events.InteractionCreate,
            description: "Command handler event",
            once: false

        })
    }
    Execute(interaction: ChatInputCommandInteraction): void {
        if(!interaction.isChatInputCommand()) return

        const command: Command = this.client.commands.get(interaction.commandName)!
        //@ts-ignore
        if(!command) return interaction.reply({content: "This command does not exist", ephemeral: true}) && this.client.commands.delete(interaction.commandName)

        try {
            const subCommandGroup = interaction.options.getSubcommandGroup(false);
            const subcommand = `${interaction.commandName}${subCommandGroup ? `.${subCommandGroup}` : ""}.${interaction.options.getSubcommand(false) || ""}`
        
            return this.client.subCommands.get(subcommand)?.Execute(interaction) || command.Execute(interaction)
        }catch(er){
            console.log(er)
        }
    }
    
}