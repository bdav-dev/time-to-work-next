import Time from "@/time/Time";
import useStateWithLocalStorage, { Serialization } from "@/hooks/UseStateWithLocalStorage";
import { convertConfigurationToReadWriteConfiguration, ReadWriteConfiguration } from "@/contexts/ConfigurationContext";


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

const TimelineConfigurationSerialization: Serialization<TimelineConfiguration> = {
    serialize: config => (
        JSON.stringify(
            {
                ...config,
                startTime: config.startTime.toString(),
                endTime: config.endTime.toString()
            }
        )
    ),
    deserialize: serializedConfig => {
        const obj = JSON.parse(serializedConfig);

        return {
            ...obj,
            startTime: Time.ofString(obj.startTime),
            endTime: Time.ofString(obj.endTime)
        };
    }
}