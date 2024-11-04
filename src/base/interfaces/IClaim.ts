export default interface IClaim {
    GuildID: string,
    Claims: {
        [InvoiceID: string]: string
    }
}