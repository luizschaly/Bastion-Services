export default interface IConfig {
    token: string;
    discordClientId: string;
    mongoURI: string;
    sellAuth: {
        shopApiKey: string;
        shopId: string
    }
    logChannels: {
        feedback: string
        outOfStock: string
        buyLogs: string
    }
}