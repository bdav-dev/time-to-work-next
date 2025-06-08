import Time from "@/time/Time";
import { WorkingTimeConfiguration } from "@/hooks/configuration/instances/UseWorkingTimeConfiguration";
import TimeComponent from "@/components/time/Time";
import ScheduleCalculations from "@/schedule/ScheduleCalculations";
import { Schedule } from "@/schedule/Schedule";
import Arrow from "@/components/misc/Arrow";


type TimeBalanceInformationBoardProps = {
    config: WorkingTimeConfiguration,
    schedule: Schedule,
    now: Time,
    className?: string,
}

export default function TimeBalanceInformationBoard(props: TimeBalanceInformationBoardProps) {

    return (
        <div className={`flex gap-2 items-center ${props.className}`}>
            <TimeComponent showPositiveSign time={props.config.timeBalance}/>
            {
                props.config.timeBalance && props.config.dailyWorkingTime &&
                <>
                    <Arrow>
                        <TimeComponent
                            className={'mx-2 text-sm leading-none'}
                            showPositiveSign
                            time={
                                ScheduleCalculations
                                    .getRemainingTimeToWork(
                                        props.schedule,
                                        props.now,
                                        props.config.dailyWorkingTime
                                    )
                                    .multiply(-1)
                            }
                        />
                    </Arrow>
                    <TimeComponent
                        showPositiveSign
                        time={
                            ScheduleCalculations.getNewTimeBalance(
                                props.schedule,
                                props.now,
                                props.config.dailyWorkingTime,
                                props.config.timeBalance
                            )
                        }
                    />
                </>
            }
        </div>
    );

}
