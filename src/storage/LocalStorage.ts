export default class LocalStorage {
    private constructor() {}

    static set(key: string, value: any) {
        window.localStorage.setItem(key, value);
    }

    static get(key: string) {
        return window.localStorage.getItem(key);
    }
}
