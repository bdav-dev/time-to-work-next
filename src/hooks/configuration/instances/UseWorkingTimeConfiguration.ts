import useStateWithLocalStorage from "@/hooks/UseStateWithLocalStorage";
import { convertConfigurationToReadWriteConfiguration } from "@/contexts/ConfigurationContext";
import { createSerialization, Serialization } from "@/serialization/Serialization";
import { ReadWriteConfiguration } from "@/configuration/Configuration";
import TimeSpan from "@/time/TimeSpan";
import { optional } from "@/util/OptionalUtils";


export type MinBreakMode = 'total' | 'straight';

export type WorkingTimeConfiguration = {
    dailyWorkingTime: TimeSpan | undefined,
    timeBalance: TimeSpan | undefined,
    _minBreak: {
        duration: TimeSpan | undefined,
        mode: MinBreakMode
    },
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
    _minBreak: {
        duration: undefined,
        mode: 'total'
    },
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
        minBreak: {
            duration: source._minBreak.duration?.toString(),
            mode: source._minBreak.mode
        },
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
        _minBreak: {
            duration: optional(target.minBreak.duration).map(TimeSpan.ofString).orUndefined(),
            mode: target.minBreak.mode
        },
        maxWorkTimeBlockDuration: optional(target.maxWorkTimeBlockDuration).map(TimeSpan.ofString).orUndefined(),
        showOptimalBreakTime: target.showOptimalBreakTime,
        _impendingWorkTimeViolation: {
            notify: target.impendingWorkTimeViolation.notify,
            threshold: optional(target.impendingWorkTimeViolation.threshold).map(TimeSpan.ofString).orUndefined()
        }
    })
});
