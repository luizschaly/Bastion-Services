export default interface IGiveaway {
    prize: string
    duration: number
    video: string
    setWinners: boolean
    winnersAmount: number
    winners: string[] | undefined
    participants: string[] | undefined
    ChannelID: string
    MessageID: string | undefined
    GiveawayID: string
    GuildID: string
}