import { ChatInputCommandInteraction, AutocompleteInteraction } from "discord.js";
import Category from "../enums/Category";
import ICommand from "../interfaces/ICommand";
import CustomClient from "./CustomClient";
import ICommandOptions from "../interfaces/ICommandsOptions";

export default class Command implements ICommand {
    client: CustomClient;
    name: string;
    description: string;
    category: Category;
    options: object;
    default_member_permissions: bigint;
    dm_permission: boolean;
    constructor(client: CustomClient, options: ICommandOptions){
        this.client = client;
        this.name = options.name;
        this.description = options.description
        this.category = options.category
        this.options = options.options
        this.default_member_permissions = options.default_member_permissions
        this.dm_permission = options.dm_permission
    }
    Execute(interaction: ChatInputCommandInteraction): void {
    }
    AutoComplete(interaction: AutocompleteInteraction): void {
    }
    
}