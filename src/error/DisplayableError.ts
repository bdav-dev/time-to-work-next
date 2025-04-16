export class DisplayableError extends Error {
    public readonly messageRetentionInSeconds: number | undefined;

    constructor(message: string, messageRetentionInSeconds?: number) {
        super(message);
        this.messageRetentionInSeconds = messageRetentionInSeconds;
        Object.setPrototypeOf(this, new.target.prototype);
    }

    static of(message: string, messageRetentionInSeconds?: number): DisplayableError {
        return new DisplayableError(message, messageRetentionInSeconds);
    }

    static unknown(): DisplayableError {
        return new DisplayableError('Ein unbekannter Fehler ist aufgetreten.');
    }

}
