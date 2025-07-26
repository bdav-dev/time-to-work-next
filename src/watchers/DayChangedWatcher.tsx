import ResolveUnclosedTimeStampDialog from "@/components/dialog/ResolveUnclosedTimeStampDialog";
import { getCurrentDateAsString } from "@/util/DateUtils";
import ScheduleCalculations from "@/schedule/ScheduleCalculations";
import { Schedule } from "@/schedule/Schedule";
import useMutatingConfigurationValue from "@/hooks/configuration/UseMutatingConfigurationValue";
import useConfigurationValue from "@/hooks/configuration/UseConfigurationValue";
import { useEffect, useState } from "react";
import useTime from "@/hooks/UseTime";
import useSchedule from "@/hooks/UseSchedule";
import Time from "@/time/Time";


export default function DayChangedWatcher() {
    const now = useTime();
    const { schedule, setSchedule, dateOfSchedule, setDateOfSchedule } = useSchedule();

    const dailyWorkingTime = useConfigurationValue(config => config.workingTime.dailyWorkingTime);
    const [timeBalance, setTimeBalance] = useMutatingConfigurationValue(config => config.workingTime.timeBalance);

    const [isResolveUnclosedTimestampDialogOpen, setIsResolveUnclosedTimestampDialogOpen] = useState(false);

    useEffect(() => {
        if (didDayChange()) {
            handleDayChange();
        }
    }, [now]);

    function didDayChange() {
        return getCurrentDateAsString() == dateOfSchedule;
    }

    function handleDayChange() {
        setDateOfSchedule(getCurrentDateAsString());

        if (!timeBalance || !dailyWorkingTime) {
            return;
        }

        if (ScheduleCalculations.hasOpenTimeStamp(schedule)) {
            setIsResolveUnclosedTimestampDialogOpen(true);
        } else {
            adjustTimeBalanceAndClearSchedule(schedule);
        }
    }

    function adjustTimeBalanceAndClearSchedule(submittedSchedule: Schedule) {
        if (!timeBalance || !dailyWorkingTime) {
            throw new Error("Time balance and daily working time required.");
        }
        if (ScheduleCalculations.hasOpenTimeStamp(submittedSchedule)) {
            throw new Error("Cannot adjust time balance since schedule has unclosed time stamp.");
        }

        setTimeBalance(
            ScheduleCalculations.getNewTimeBalance(
                submittedSchedule,
                Time.midnight(), // Will never be used since it is ensued that the schedule has no open time stamps.
                dailyWorkingTime,
                timeBalance
            )
        );
        setSchedule(() => []);
    }

    return (
        <ResolveUnclosedTimeStampDialog
            isOpen={isResolveUnclosedTimestampDialogOpen}
            onSubmit={
                submittedSchedule => {
                    adjustTimeBalanceAndClearSchedule(submittedSchedule);
                    setIsResolveUnclosedTimestampDialogOpen(false);
                }
            }
        />
    );

}