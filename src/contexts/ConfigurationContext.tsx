'use client';

import { createContext, Dispatch, SetStateAction } from "react";
import { replaceValue } from "@/util/ObjectUtils";
import useTimelineConfiguration from "@/hooks/configuration/instances/UseTimelineConfiguration";
import { ContextProviderProps } from "@/contexts/ContextTypes";
import usePublicTransitConfiguration from "@/hooks/configuration/instances/UsePublicTransitConfiguration";
import { ConfigurationContextType, EmptyConfiguration, ReadWriteConfiguration } from "@/configuration/Configuration";
import useWorkingTimeConfiguration from "@/hooks/configuration/instances/UseWorkingTimeSettings";


export const ConfigurationContext = createContext<ConfigurationContextType>(EmptyConfiguration);

export default function ConfigurationProvider(props: ContextProviderProps) {
    const timelineConfiguration = useTimelineConfiguration();
    const publicTransitConfiguration = usePublicTransitConfiguration();
    const workingTimeConfiguration = useWorkingTimeConfiguration();

    return (
        <ConfigurationContext.Provider
            value={{
                timeline: timelineConfiguration,
                publicTransit: publicTransitConfiguration,
                workingTime: workingTimeConfiguration
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
