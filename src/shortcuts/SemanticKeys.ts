export type Key = ' ' | 'Enter' | 'j' | 's' | 'a';

export class SemanticKeys {
    private constructor() {}

    static readonly SET_TO_DEFAULT: Key = 's';
    static readonly SET_TO_CURRENT_TIME: Key = 'j';
    static readonly SET_TO_ADJACENT: Key = 'a';
    static readonly SUBMIT: Key = 'Enter';
}
