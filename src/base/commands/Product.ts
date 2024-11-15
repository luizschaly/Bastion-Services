import {
  ApplicationCommandOptionType,
  PermissionsBitField,
} from "discord.js";
import Command from "../classes/Command";
import CustomClient from "../classes/CustomClient";
import Category from "../enums/Category";

export default class Product extends Command {
  constructor(client: CustomClient) {
    super(client, {
      name: "product",
      description: "General product commands.",
      category: Category.Tickets,
      default_member_permissions: PermissionsBitField.Flags.Administrator,
      dm_permission: false,
      options: [
        {
          name: "createfree",
          description: "Creates a free product",
          type: ApplicationCommandOptionType.Subcommand,
          options: [
            {
              name: "product",
              description: "Name of the product",
              type: ApplicationCommandOptionType.String,
              required: true
            },
            {
              name: "description",
              description: "The description of your new product",
              type: ApplicationCommandOptionType.String,
              required: true
            },
            {
              name: "video",
              description: "Video showcase for the free product",
              type: ApplicationCommandOptionType.String,
              required: true
            },
          ]
        },
        
        {
          name: "optionadd",
          description: "Adds an option to a product",
          type: ApplicationCommandOptionType.Subcommand,
          options: [
            {
              name: "product",
              description: "Product to add the option",
              type: ApplicationCommandOptionType.String,
              required: true
            },
            {
              name: "name",
              description: "Title of the option",
              type: ApplicationCommandOptionType.String,
              required: true
            },
            {
              name: "value",
              description: "Value of the option",
              type: ApplicationCommandOptionType.Number,
              required: true
            },
            {
              name: "api",
              description: "Api for the option",
              type: ApplicationCommandOptionType.String,
              required: false
            },
          ]
        },
        {
          name: "create",
          description: "Creates a new product.",
          type: ApplicationCommandOptionType.Subcommand,
          options: [
            {
              name: "name",
              description: "The name of your new product",
              type: ApplicationCommandOptionType.String,
              required: true
            },
            {
              name: "description",
              description: "The description of your new product",
              type: ApplicationCommandOptionType.String,
              required: true
            },
            {
              name: "image",
              description: "The image of your new product",
              type: ApplicationCommandOptionType.String,
              required: true
            },
            {
              name: "status",
              description: "Initial status of your new product",
              type: ApplicationCommandOptionType.String,
              choices: [
                {name:"Out of Stock" ,value: "https://i.imgur.com/jj3hoXW.png"},
                {name:"Undetected" ,value: "https://i.imgur.com/ofbB3aN.png"},
                {name:"Detected" ,value: "https://i.imgur.com/feOLKNP.png"},
                {name:"Updating" ,value: "https://i.imgur.com/PnWOzDG.png"},
                {name:"Soon" ,value: "https://i.imgur.com/K5jvTRy.png"},
              ],
              required: true
            },
          ],
        },
      ],
    });
  }
}
