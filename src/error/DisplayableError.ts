export class DisplayableError extends Error {
    public readonly messageRetentionInSeconds: number | undefined;

    constructor(message: string, messageRetentionInSeconds?: number) {
        super(message);
        this.messageRetentionInSeconds = messageRetentionInSeconds;
        Object.setPrototypeOf(this, new.target.prototype);
    }

}
