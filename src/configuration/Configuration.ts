import { convertConfigurationToReadWriteConfiguration } from "@/contexts/ConfigurationContext";

export type ReadWriteConfigurationValue<T> = {
    value: T,
    set: (value: T) => void
}
export type ReadWriteConfiguration<O extends object> = {
    [K in keyof O]: ReadWriteConfigurationValue<O[K]>
}
export type FlatReadWriteConfigurationValue<T> = [T, (value: T) => void];
export type FlatReadWriteConfigurationValueWithFallback<T> = [T, (value?: T) => void];

export function createEmptyConfiguration<T extends object>(configuration: T) {
    return convertConfigurationToReadWriteConfiguration(configuration, () => {});
}
