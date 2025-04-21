import useStateWithLocalStorage from "@/hooks/UseStateWithLocalStorage";
import { convertConfigurationToReadWriteConfiguration } from "@/contexts/ConfigurationContext";
import { createJsonSerialization, Serialization } from "@/serialization/Serialization";
import { ReadWriteConfiguration } from "@/configuration/Configuration";
import TimeSpan from "@/time/TimeSpan";


export type WorkingTimeConfiguration = {
    dailyWorkingTime: TimeSpan | undefined,
    timeBalance: TimeSpan | undefined
}

export const DefaultWorkingTimeConfiguration: WorkingTimeConfiguration = {
    dailyWorkingTime: undefined,
    timeBalance: undefined
}

export default function useWorkingTimeConfiguration(): ReadWriteConfiguration<WorkingTimeConfiguration> {
    const [workingTimeConfiguration, setWorkingTimeConfiguration] = useStateWithLocalStorage<WorkingTimeConfiguration>(
        'ttw-n.config.workingTime',
        DefaultWorkingTimeConfiguration,
        WorkingTimeConfigurationSerialization
    );
    return convertConfigurationToReadWriteConfiguration(workingTimeConfiguration, setWorkingTimeConfiguration);
}

const WorkingTimeConfigurationSerialization: Serialization<WorkingTimeConfiguration> = createJsonSerialization({
    serialize: source => ({
        dailyWorkingTime: source.dailyWorkingTime?.toString(),
        timeBalance: source.timeBalance?.toString()
    }),
    deserialize: target => ({
        dailyWorkingTime: target.dailyWorkingTime && TimeSpan.ofString(target.dailyWorkingTime) || undefined,
        timeBalance: target.timeBalance && TimeSpan.ofString(target.timeBalance) || undefined,
    })
});
