import Time from "@/time/Time";
import useStateWithLocalStorage from "@/hooks/UseStateWithLocalStorage";
import { convertConfigurationToReadWriteConfiguration } from "@/contexts/ConfigurationContext";
import { createJsonSerialization, Serialization } from "@/serialization/Serialization";
import { ReadWriteConfiguration } from "@/configuration/Configuration";


export type TimelineConfiguration = {
    startTime: Time,
    endTime: Time,
    automaticTimeBoundsIfOverflow: boolean,
    amountOfMajorTimeSteps: number,
    automaticAmountOfMajorTimeSteps: boolean,
    amountOfMinorTimeSteps: number,
    offTimeSize: number
}

export const DefaultTimelineConfiguration: TimelineConfiguration = {
    startTime: Time.ofString('07:00'),
    endTime: Time.ofString('18:00'),
    automaticTimeBoundsIfOverflow: true,
    automaticAmountOfMajorTimeSteps: true,
    amountOfMajorTimeSteps: 12,
    amountOfMinorTimeSteps: 3,
    offTimeSize: 9
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