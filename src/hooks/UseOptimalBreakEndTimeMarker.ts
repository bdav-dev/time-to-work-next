import useConfigurationValue from "@/hooks/configuration/UseConfigurationValue";
import useTime from "@/hooks/UseTime";
import { useMemo } from "react";
import { TimelineMarker } from "@/components/timeline/module/TimelineTypes";
import ScheduleCalculations from "@/schedule/ScheduleCalculations";
import { TimelineMarkerColors } from "@/components/timeline/TimelineColors";
import useSchedule from "@/hooks/UseSchedule";


export default function useOptimalBreakEndTimeMarker(): TimelineMarker | undefined {
    const { schedule } = useSchedule();
    const now = useTime();

    const minBreak = useConfigurationValue(config => config.workingTime.minBreak);
    const showOptimalBreakTime = useConfigurationValue(config => config.workingTime.showOptimalBreakTime);

    return useMemo(() => {
        const openTimeStamp = ScheduleCalculations.getOpenTimestamp(schedule);
        if (!showOptimalBreakTime || !minBreak || !openTimeStamp || openTimeStamp.timeType.identifier != "breakTime") {
            return undefined;
        }

        const sumOfBreakTime = ScheduleCalculations.getSumOfBreakTime(schedule, now);
        const remainingBreakTime = minBreak.subtract(sumOfBreakTime);
        if (remainingBreakTime.isNegative()) {
            return undefined;
        }

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

    }, [schedule, minBreak, showOptimalBreakTime]);
}
