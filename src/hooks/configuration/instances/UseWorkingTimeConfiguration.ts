import useStateWithLocalStorage from "@/hooks/UseStateWithLocalStorage";
import { convertConfigurationToReadWriteConfiguration } from "@/contexts/ConfigurationContext";
import { createSerialization, Serialization } from "@/serialization/Serialization";
import { ReadWriteConfiguration } from "@/configuration/Configuration";
import TimeSpan from "@/time/TimeSpan";
import { optional } from "@/util/OptionalUtils";


export type WorkingTimeConfiguration = {
    dailyWorkingTime: TimeSpan | undefined,
    timeBalance: TimeSpan | undefined,
    minBreak: TimeSpan | undefined,
    maxWorkTimeBlockDuration: TimeSpan | undefined,
    _impendingWorkTimeViolation: {
        notify: boolean,
        threshold: TimeSpan | undefined
    }
    showOptimalBreakTime: boolean
}

export const DefaultWorkingTimeConfiguration: WorkingTimeConfiguration = {
    dailyWorkingTime: undefined,
    timeBalance: undefined,
    minBreak: undefined,
    maxWorkTimeBlockDuration: undefined,
    _impendingWorkTimeViolation: {
        notify: true,
        threshold: TimeSpan.ofString("00:15")
    },
    showOptimalBreakTime: true
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
        showOptimalBreakTime: source.showOptimalBreakTime,
        impendingWorkTimeViolation: {
            notify: source._impendingWorkTimeViolation.notify,
            threshold: source._impendingWorkTimeViolation.threshold?.toString()
        }
    }),
    decode: target => ({
        dailyWorkingTime: optional(target.dailyWorkingTime).map(TimeSpan.ofString).orUndefined(),
        timeBalance: optional(target.timeBalance).map(TimeSpan.ofString).orUndefined(),
        minBreak: optional(target.minBreak).map(TimeSpan.ofString).orUndefined(),
        maxWorkTimeBlockDuration: optional(target.maxWorkTimeBlockDuration).map(TimeSpan.ofString).orUndefined(),
        showOptimalBreakTime: target.showOptimalBreakTime,
        _impendingWorkTimeViolation: {
            notify: target.impendingWorkTimeViolation.notify,
            threshold: optional(target.impendingWorkTimeViolation.threshold).map(TimeSpan.ofString).orUndefined()
        }
    })
});
