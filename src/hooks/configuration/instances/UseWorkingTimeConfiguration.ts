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
    _impendingMaxWorkTimeBlockViolation: {
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
    _impendingMaxWorkTimeBlockViolation: {
        notify: true,
        threshold: TimeSpan.ofString("00:15")
    },
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
        showOptimalBreakTime: source.showOptimalBreakTime,
        impendingMaxWorkTimeBlockViolation: {
            notify: source._impendingMaxWorkTimeBlockViolation.notify,
            threshold: source._impendingMaxWorkTimeBlockViolation.threshold?.toString()
        }
    }),
    decode: target => ({
        dailyWorkingTime: optional(target.dailyWorkingTime).map(TimeSpan.ofString).orUndefined(),
        timeBalance: optional(target.timeBalance).map(TimeSpan.ofString).orUndefined(),
        minBreak: optional(target.minBreak).map(TimeSpan.ofString).orUndefined(),
        maxWorkTimeBlockDuration: optional(target.maxWorkTimeBlockDuration).map(TimeSpan.ofString).orUndefined(),
        showOptimalBreakTime: target.showOptimalBreakTime,
        _impendingMaxWorkTimeBlockViolation: {
            notify: target.impendingMaxWorkTimeBlockViolation.notify,
            threshold: optional(target.impendingMaxWorkTimeBlockViolation.threshold).map(TimeSpan.ofString).orUndefined()
        }
    })
});
