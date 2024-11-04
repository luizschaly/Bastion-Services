import { Collection, Events, REST, Routes } from 'discord.js';
import Event from '../../classes/Event';
import CustomClient from "../../classes/CustomClient";
import Command from '../../classes/Command';

export default class Ready extends Event{
    constructor(client: CustomClient){
        super(client, {
            name: Events.ClientReady,
            description: "Ready Event",
            once: true
        })
    }
    async Execute() {
        console.log(`${this.client.user?.tag} is now ready`)

        const commands: object[] = this.GetJson(this.client.commands)

        const rest = new REST().setToken(this.client.config.token)

        const setCommands: any = await rest.put(Routes.applicationCommands(this.client.config.discordClientId), {
            body: commands
        })

        console.log(`Successfully set ${setCommands.length} commands`)
    }

    private GetJson(commands: Collection<string, Command>){
        const data: object[] = []
        commands.forEach(command => {
            data.push({
                name: command.name,
                description: command.description, 
                options: command.options,
                default_member_permissions: command.default_member_permissions.toString(),
                dm_permission: command.dm_permission
            })
        })
        return data
    }
}