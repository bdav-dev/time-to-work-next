import useConfigurationValue from "@/hooks/configuration/UseConfigurationValue";
import useTime from "@/hooks/UseTime";
import { useMemo } from "react";
import { TimelineMarker } from "@/components/timeline/module/TimelineTypes";
import ScheduleCalculations from "@/schedule/ScheduleCalculations";
import { TimelineMarkerColors } from "@/components/timeline/TimelineColors";
import useSchedule from "@/hooks/UseSchedule";
import { compare } from "@/util/CompareUtils";


export default function useOptimalBreakEndTimeMarker(): TimelineMarker | undefined {
    const { schedule } = useSchedule();
    const now = useTime();

    const minBreakDuration = useConfigurationValue(config => config.workingTime._minBreak.duration);
    const showOptimalBreakTime = useConfigurationValue(config => config.workingTime.showOptimalBreakTime);

    return useMemo(() => {
        const openTimeStamp = ScheduleCalculations.getOpenTimestamp(schedule);
        if (!showOptimalBreakTime || !minBreakDuration || !openTimeStamp || openTimeStamp.timeType.identifier != "breakTime") {
            return undefined;
        }

        const sumOfBreakTime = ScheduleCalculations.getSumOfBreakTime(schedule, now);
        const sumOfClosedBreakTime = ScheduleCalculations.getSumOfClosedBreakTime(schedule);
        if (compare(sumOfClosedBreakTime, 'greaterOrEqualThan', minBreakDuration)) {
            return undefined;
        }

        const remainingBreakTime = minBreakDuration.subtract(sumOfBreakTime);
        const optimalBreakEndTime = now.asTimeSpan().add(remainingBreakTime).asTime(true);

        return {
            time: optimalBreakEndTime,
            title: optimalBreakEndTime.toString(),
            color: TimelineMarkerColors.GREEN,
            labelDistance: "-6px",
            labelPosition: 'bottom',
            filled: true,
            height: 1.11
        };

    }, [schedule, minBreakDuration, showOptimalBreakTime]);
}
