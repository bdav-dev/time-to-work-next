




export type RequireProperty<T, K extends keyof T> =
    Omit<T, K> & Required<Pick<T, K>>;
