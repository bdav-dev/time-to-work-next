import { TimelineConfiguration } from "@/hooks/configuration/instances/UseTimelineConfiguration";
import { PublicTransitConfiguration } from "@/hooks/configuration/instances/UsePublicTransitConfiguration";
import EmptyConfigurationReadWriteValue from "@/configuration/EmptyConfigurationReadWriteValue";
import { PublicTransitTypes } from "@/publicTransit/PublicTransitType";
import TimeSpan from "@/time/TimeSpan";


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
}
export const EmptyConfiguration: ConfigurationContextType = {
    timeline: {
        startTime: EmptyConfigurationReadWriteValue.TIME,
        endTime: EmptyConfigurationReadWriteValue.TIME,
        amountOfMinorTimeSteps: EmptyConfigurationReadWriteValue.NUMBER,
        amountOfMajorTimeSteps: EmptyConfigurationReadWriteValue.NUMBER,
        automaticTimeBoundsIfOverflow: EmptyConfigurationReadWriteValue.BOOLEAN,
        automaticAmountOfMajorTimeSteps: EmptyConfigurationReadWriteValue.BOOLEAN,
        offTimeSize: EmptyConfigurationReadWriteValue.NUMBER
    },
    publicTransit: {
        isPublicTransitFeatureEnabled: EmptyConfigurationReadWriteValue.BOOLEAN,
        type: { value: PublicTransitTypes.TRAIN, set: () => {} },
        startTime: EmptyConfigurationReadWriteValue.TIME,
        period: EmptyConfigurationReadWriteValue.TIME_SPAN,
        travelTime: EmptyConfigurationReadWriteValue.UNDEFINED as ReadWriteConfigurationValue<TimeSpan | undefined>,
        gracePeriod: EmptyConfigurationReadWriteValue.TIME_SPAN
    }
}