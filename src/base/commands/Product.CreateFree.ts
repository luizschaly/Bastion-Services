import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  EmbedBuilder,
} from "discord.js";
import CustomClient from "../classes/CustomClient";
import SubCommand from "../classes/SubCommand";
import Colors from "../enums/Colors";
import productSchema from "../schemas/product";
import Emojis from "../enums/Emojis";

export default class ProductCreateFree extends SubCommand {
  constructor(client: CustomClient) {
    super(client, {
      name: "product.createfree",
    });
  }

  async Execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const productName = interaction.options.getString("product");
    const description = interaction.options.getString("description");
    const video = interaction.options.getString("video");
    const embed = new EmbedBuilder()
      .setThumbnail("https://i.imgur.com/ofbB3aN.png")
      .setTitle(productName)
      .setColor(Colors.Invisible)
      .setDescription(
        `${description}\n ${Emojis.BlurpleDot} [Click here for video showcase](${video})`
      );
    const button = new ButtonBuilder()
    .setLabel("Get")
    .setEmoji("<:blurplestar:1299461891583774730>")
    .setCustomId("freeProduct")
    .setStyle(ButtonStyle.Success)
    const row = new ActionRowBuilder().setComponents(button)
    //@ts-ignore
    await interaction.channel?.send({ embeds: [embed], components: [row] });
  }
}
