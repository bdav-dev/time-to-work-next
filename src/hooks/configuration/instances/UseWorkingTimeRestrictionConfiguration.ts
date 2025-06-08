import useStateWithLocalStorage from "@/hooks/UseStateWithLocalStorage";
import { convertConfigurationToReadWriteConfiguration } from "@/contexts/ConfigurationContext";
import { createSerialization, Serialization } from "@/serialization/Serialization";
import { ReadWriteConfiguration } from "@/configuration/Configuration";
import TimeSpan from "@/time/TimeSpan";


export type WorkingTimeRestrictionConfiguration = {
    minBreak: TimeSpan | undefined,
    maxWorkTimeBlockDuration: TimeSpan | undefined
}

export const DefaultWorkingTimeRestrictionConfiguration: WorkingTimeRestrictionConfiguration = {
    minBreak: undefined,
    maxWorkTimeBlockDuration: undefined
}

export default function useWorkingTimeRestrictionConfiguration(): ReadWriteConfiguration<WorkingTimeRestrictionConfiguration> {
    const [workingTimeConfiguration, setWorkingTimeConfiguration] = useStateWithLocalStorage<WorkingTimeRestrictionConfiguration>(
        'ttw-n.config.workingTimeRestrictions',
        DefaultWorkingTimeRestrictionConfiguration,
        WorkingTimeRestrictionConfigurationSerialization
    );
    return convertConfigurationToReadWriteConfiguration(workingTimeConfiguration, setWorkingTimeConfiguration);
}

const WorkingTimeRestrictionConfigurationSerialization: Serialization<WorkingTimeRestrictionConfiguration> = createSerialization({
    encode: source => ({
        minBreak: source.minBreak?.toString(),
        maxWorkTimeBlockDuration: source.maxWorkTimeBlockDuration?.toString()
    }),
    decode: target => ({
        minBreak: target.minBreak ? TimeSpan.ofString(target.minBreak) : undefined,
        maxWorkTimeBlockDuration: target.maxWorkTimeBlockDuration ? TimeSpan.ofString(target.maxWorkTimeBlockDuration) : undefined,
    })
});
