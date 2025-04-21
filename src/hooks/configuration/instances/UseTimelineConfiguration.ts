import Time from "@/time/Time";
import useStateWithLocalStorage from "@/hooks/UseStateWithLocalStorage";
import { convertConfigurationToReadWriteConfiguration } from "@/contexts/ConfigurationContext";
import { createJsonSerialization, Serialization } from "@/serialization/Serialization";
import { ReadWriteConfiguration } from "@/configuration/Configuration";


export type TimelineConfiguration = {
    startTime: Time,
    endTime: Time,
    automaticTimeBoundsOnOverflow: boolean,
    automaticAmountOfTimeSteps: boolean,
    amountOfTimeSteps: number,
    amountOfSubTimeSteps: number,
    marginSize: number
}

export const DefaultTimelineConfiguration: TimelineConfiguration = {
    startTime: Time.ofString('06:00'),
    endTime: Time.ofString('18:00'),
    automaticTimeBoundsOnOverflow: true,
    automaticAmountOfTimeSteps: true,
    amountOfTimeSteps: 13,
    amountOfSubTimeSteps: 3,
    marginSize: 9
}

export default function useTimelineConfiguration(): ReadWriteConfiguration<TimelineConfiguration> {
    const [timelineConfiguration, setTimelineConfiguration] = useStateWithLocalStorage<TimelineConfiguration>(
        'ttw-n.config.timeline',
        DefaultTimelineConfiguration,
        TimelineConfigurationSerialization
    );
    return convertConfigurationToReadWriteConfiguration(timelineConfiguration, setTimelineConfiguration);
}

const TimelineConfigurationSerialization: Serialization<TimelineConfiguration> = createJsonSerialization({
    serialize: source => ({
        ...source,
        startTime: source.startTime.toString(),
        endTime: source.endTime.toString()
    }),
    deserialize: target => ({
        ...target,
        startTime: Time.ofString(target.startTime),
        endTime: Time.ofString(target.endTime)
    })
});
