'use client';

import { createContext, Dispatch, SetStateAction } from "react";
import { replaceValue } from "@/util/ObjectUtils";
import useTimelineConfiguration, { TimelineConfiguration } from "@/hooks/configuration/settings/UseTimelineConfiguration";
import { ContextProviderProps } from "@/contexts/ContextTypes";
import EmptyConfigurationReadWriteValue from "@/util/EmptyConfigurationReadWriteValue";


export type ReadWriteConfigurationValue<T> = {
    value: T,
    set: (value: T) => void
}
export type ReadWriteConfiguration<O extends object> = {
    [K in keyof O]: ReadWriteConfigurationValue<O[K]>
}
export type FlatReadWriteConfigurationValue<T> = [T, (value: T) => void];
export type FlatReadWriteConfigurationValueWithFallback<T> = [T, (value?: T) => void];

export type ConfigurationContextType = {
    timeline: ReadWriteConfiguration<TimelineConfiguration>
}
const EmptyConfiguration: ConfigurationContextType = {
    timeline: {
        startTime: EmptyConfigurationReadWriteValue.TIME,
        endTime: EmptyConfigurationReadWriteValue.TIME,
        amountOfMinorTimeSteps: EmptyConfigurationReadWriteValue.NUMBER,
        amountOfMajorTimeSteps: EmptyConfigurationReadWriteValue.NUMBER,
        automaticTimeBoundsIfOverflow: EmptyConfigurationReadWriteValue.BOOLEAN,
        automaticAmountOfMajorTimeSteps: EmptyConfigurationReadWriteValue.BOOLEAN,
        offTimeSize: EmptyConfigurationReadWriteValue.NUMBER
    }
}
export const ConfigurationContext = createContext<ConfigurationContextType>(EmptyConfiguration);

export default function ConfigurationProvider(props: ContextProviderProps) {
    const timelineConfiguration = useTimelineConfiguration();

    return (
        <ConfigurationContext.Provider
            value={{
                timeline: timelineConfiguration
            }}
        >
            {props.children}
        </ConfigurationContext.Provider>
    );
}

export function setConfigurationValue<T extends object>(
    setStateAction: Dispatch<SetStateAction<T>>,
    key: keyof T,
    value: T[keyof T]
) {
    setStateAction(config => replaceValue(config, key, value));
}

export function convertConfigurationToReadWriteConfiguration<T extends object>(
    configuration: T,
    setConfiguration: Dispatch<SetStateAction<T>>
): ReadWriteConfiguration<T> {
    return (
        Object.entries(configuration)
            .reduce(
                (readWriteConfiguration, [key, value]) => ({
                    ...readWriteConfiguration,
                    [key]: {
                        value,
                        set: (value: any) => setConfigurationValue(setConfiguration, key as keyof T, value)
                    }
                }),
                {}
            ) as ReadWriteConfiguration<T>
    );
}
