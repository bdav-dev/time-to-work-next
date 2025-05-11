import ResolveUnclosedTimeStampDialog from "@/components/dialog/ResolveUnclosedTimeStampDialog";
import { getCurrentDateAsString } from "@/util/DateUtils";
import ScheduleCalculations from "@/schedule/ScheduleCalculations";
import { Schedule } from "@/schedule/Schedule";
import useMutatingConfigurationValue from "@/hooks/configuration/UseMutatingConfigurationValue";
import useConfigurationValue from "@/hooks/configuration/UseConfigurationValue";
import { useEffect, useState } from "react";
import useTime from "@/hooks/UseTime";
import useSchedule from "@/hooks/UseSchedule";


export default function UnclosedTimeStampWatcher() {
    const now = useTime();
    const { schedule, setSchedule, dateOfSchedule, setDateOfSchedule } = useSchedule();

    const dailyWorkingTime = useConfigurationValue(config => config.workingTime.dailyWorkingTime);
    const [timeBalance, setTimeBalance] = useMutatingConfigurationValue(config => config.workingTime.timeBalance);

    const [isResolveUnclosedTimestampDialogOpen, setIsResolveUnclosedTimestampDialogOpen] = useState(false);

    useEffect(() => checkForDayChange(), [now]);

    function checkForDayChange() {
        const currentDateAsString = getCurrentDateAsString();

        if (currentDateAsString == dateOfSchedule || !timeBalance || !dailyWorkingTime) {
            return;
        }

        if (ScheduleCalculations.hasOpenTimeStamp(schedule)) {
            setIsResolveUnclosedTimestampDialogOpen(true);
        } else {
            adjustTimeBalanceAndResetSchedule(schedule);
        }
    }

    function adjustTimeBalanceAndResetSchedule(submittedSchedule: Schedule) {
        if (!timeBalance || !dailyWorkingTime) {
            return;
        }

        setTimeBalance(
            ScheduleCalculations.getNextDayTimeBalance(submittedSchedule, dailyWorkingTime, timeBalance)
        );

        setSchedule(() => []);
        setDateOfSchedule(getCurrentDateAsString());
    }

    return (
        <ResolveUnclosedTimeStampDialog
            isOpen={isResolveUnclosedTimestampDialogOpen}
            onSubmit={submittedSchedule => {
                adjustTimeBalanceAndResetSchedule(submittedSchedule);
                setIsResolveUnclosedTimestampDialogOpen(false);
            }}
        />
    );

}