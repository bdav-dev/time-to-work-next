import useConfigurationValue from "@/hooks/configuration/UseConfigurationValue";
import useTime from "@/hooks/UseTime";
import { useMemo } from "react";
import { TimelineMarker } from "@/components/timeline/module/TimelineTypes";
import ScheduleCalculations from "@/schedule/ScheduleCalculations";
import { TimelineMarkerColors } from "@/components/timeline/TimelineColors";
import useSchedule from "@/hooks/UseSchedule";
import { compare } from "@/util/CompareUtils";
import useConfigurationBundle from "@/hooks/configuration/UseConfigurationBundle";
import TimeSpan from "@/time/TimeSpan";
import { MinBreakMode } from "@/hooks/configuration/instances/UseWorkingTimeConfiguration";
import { Schedule, ScheduleBlock } from "@/schedule/Schedule";
import Time from "@/time/Time";


export default function useOptimalBreakEndTimeMarker(): TimelineMarker | undefined {
    const { schedule } = useSchedule();
    const now = useTime();

    const minBreak = useConfigurationBundle(config => config.workingTime._minBreak);
    const showOptimalBreakTime = useConfigurationValue(config => config.workingTime.showOptimalBreakTime);

    return useMemo(() => {
        const openTimeStamp = ScheduleCalculations.getOpenTimestamp(schedule);
        if (!showOptimalBreakTime || !minBreak.duration || !openTimeStamp || openTimeStamp.timeType.identifier != "breakTime") {
            return;
        }

        const remainingBreakTime = calculateRemainingBreakTime(schedule, openTimeStamp, { mode: minBreak.mode, duration: minBreak.duration }, now);
        if (!remainingBreakTime) {
            return;
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

    }, [schedule, minBreak.duration, minBreak.mode, showOptimalBreakTime]);
}

function calculateRemainingBreakTime(schedule: Schedule, openBreakTimeStamp: ScheduleBlock, minBreak: { duration: TimeSpan, mode: MinBreakMode }, now: Time) {
    if (minBreak.mode === 'straight') {
        const minBreakTimeAlreadyTaken = ScheduleCalculations.hasClosedBreakTimeBlockGreaterThanOrEqualToTimeSpan(schedule, minBreak.duration);
        if (minBreakTimeAlreadyTaken) {
            return;
        }
        return minBreak.duration.subtract(TimeSpan.ofTimeDifference(openBreakTimeStamp.startTime, now));

    } else if (minBreak.mode === 'total') {
        const minBreakTimeAlreadyTaken = compare(ScheduleCalculations.getSumOfClosedBreakTime(schedule), 'greaterOrEqualThan', minBreak.duration);
        if (minBreakTimeAlreadyTaken) {
            return;
        }
        return minBreak.duration.subtract(ScheduleCalculations.getSumOfBreakTime(schedule, now));
    }
    return;
}
