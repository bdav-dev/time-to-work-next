import { DefaultTimelineConfiguration, TimelineConfiguration } from "@/hooks/configuration/instances/UseTimelineConfiguration";
import { DefaultPublicTransitConfiguration, PublicTransitConfiguration } from "@/hooks/configuration/instances/UsePublicTransitConfiguration";
import { DefaultWorkingTimeConfiguration, WorkingTimeConfiguration } from "@/hooks/configuration/instances/UseWorkingTimeConfiguration";
import { convertConfigurationToReadWriteConfiguration } from "@/contexts/ConfigurationContext";
import { DefaultWorkingTimeRestrictionConfiguration, WorkingTimeRestrictionConfiguration } from "@/hooks/configuration/instances/UseWorkingTimeRestrictionConfiguration";


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
    timeline: ReadWriteConfiguration<TimelineConfiguration>,
    publicTransit: ReadWriteConfiguration<PublicTransitConfiguration>,
    workingTime: ReadWriteConfiguration<WorkingTimeConfiguration>,
    workingTimeRestrictions: ReadWriteConfiguration<WorkingTimeRestrictionConfiguration>
}

export const EmptyConfiguration: ConfigurationContextType = {
    timeline: createEmptyConfiguration(DefaultTimelineConfiguration),
    publicTransit: createEmptyConfiguration(DefaultPublicTransitConfiguration),
    workingTime: createEmptyConfiguration(DefaultWorkingTimeConfiguration),
    workingTimeRestrictions: createEmptyConfiguration(DefaultWorkingTimeRestrictionConfiguration)
}

function createEmptyConfiguration<T extends object>(configuration: T) {
    return convertConfigurationToReadWriteConfiguration(configuration, () => {});
}
