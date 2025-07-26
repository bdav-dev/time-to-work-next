'use client';

import { createContext, Dispatch, SetStateAction } from "react";
import { replaceValue } from "@/util/ObjectUtils";
import useTimelineConfiguration, { DefaultTimelineConfiguration, TimelineConfiguration } from "@/hooks/configuration/instances/UseTimelineConfiguration";
import { ContextProviderProps } from "@/contexts/ContextTypes";
import usePublicTransitConfiguration, { DefaultPublicTransitConfiguration, PublicTransitConfiguration } from "@/hooks/configuration/instances/UsePublicTransitConfiguration";
import { createEmptyConfiguration, ReadWriteConfiguration } from "@/configuration/Configuration";
import useWorkingTimeConfiguration, { DefaultWorkingTimeConfiguration, WorkingTimeConfiguration } from "@/hooks/configuration/instances/UseWorkingTimeConfiguration";

export type ConfigurationContextType = {
    timeline: ReadWriteConfiguration<TimelineConfiguration>,
    publicTransit: ReadWriteConfiguration<PublicTransitConfiguration>,
    workingTime: ReadWriteConfiguration<WorkingTimeConfiguration>,
}

export const EmptyConfiguration: ConfigurationContextType = {
    timeline: createEmptyConfiguration(DefaultTimelineConfiguration),
    publicTransit: createEmptyConfiguration(DefaultPublicTransitConfiguration),
    workingTime: createEmptyConfiguration(DefaultWorkingTimeConfiguration),
}

export const ConfigurationContext = createContext<ConfigurationContextType>(EmptyConfiguration);

export default function ConfigurationProvider({ children }: ContextProviderProps) {
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
            {children}
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
                    [key]: key.startsWith("_")
                        ? convertConfigurationToReadWriteConfiguration(value, setConfiguration)
                        : {
                            value,
                            set: (value: any) => setConfigurationValue(setConfiguration, key as keyof T, value)
                        }
                }),
                {}
            ) as ReadWriteConfiguration<T>
    );
}
