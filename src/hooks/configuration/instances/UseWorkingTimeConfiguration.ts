import useStateWithLocalStorage from "@/hooks/UseStateWithLocalStorage";
import { convertConfigurationToReadWriteConfiguration } from "@/contexts/ConfigurationContext";
import { createSerialization, Serialization } from "@/serialization/Serialization";
import { ReadWriteConfiguration } from "@/configuration/Configuration";
import TimeSpan from "@/time/TimeSpan";


export type WorkingTimeConfiguration = {
    dailyWorkingTime: TimeSpan | undefined,
    timeBalance: TimeSpan | undefined,
    minBreak: TimeSpan | undefined,
    maxWorkTimeBlockDuration: TimeSpan | undefined,
    showOptimalBreakTime: boolean
}

export const DefaultWorkingTimeConfiguration: WorkingTimeConfiguration = {
    dailyWorkingTime: undefined,
    timeBalance: undefined,
    minBreak: undefined,
    maxWorkTimeBlockDuration: undefined,
    showOptimalBreakTime: false
}

export default function useWorkingTimeConfiguration(): ReadWriteConfiguration<WorkingTimeConfiguration> {
    const [workingTimeConfiguration, setWorkingTimeConfiguration] = useStateWithLocalStorage<WorkingTimeConfiguration>(
        'ttw-n.config.workingTime',
        DefaultWorkingTimeConfiguration,
        WorkingTimeConfigurationSerialization
    );
    return convertConfigurationToReadWriteConfiguration(workingTimeConfiguration, setWorkingTimeConfiguration);
}

const WorkingTimeConfigurationSerialization: Serialization<WorkingTimeConfiguration> = createSerialization({
    encode: source => ({
        dailyWorkingTime: source.dailyWorkingTime?.toString(),
        timeBalance: source.timeBalance?.toString(),
        minBreak: source.minBreak?.toString(),
        maxWorkTimeBlockDuration: source.maxWorkTimeBlockDuration?.toString(),
        showOptimalBreakTime: source.showOptimalBreakTime
    }),
    decode: target => ({
        dailyWorkingTime: target.dailyWorkingTime ? TimeSpan.ofString(target.dailyWorkingTime) : undefined,
        timeBalance: target.timeBalance ? TimeSpan.ofString(target.timeBalance) : undefined,
        minBreak: target.minBreak ? TimeSpan.ofString(target.minBreak) : undefined,
        maxWorkTimeBlockDuration: target.maxWorkTimeBlockDuration ? TimeSpan.ofString(target.maxWorkTimeBlockDuration) : undefined,
        showOptimalBreakTime: target.showOptimalBreakTime
    })
});
