import Timeline, { TimelineProps } from "@/components/timeline/Timeline";
import useTime from "@/hooks/UseTime";
import useConfiguration from "@/hooks/configuration/UseConfiguration";
import { mapScheduleToTimelineData, Schedule, ScheduleToTimelineDataMapOptions } from "@/schedule/Schedule";


type ConfiguredTimelineProps = {
    schedule: Schedule,
    scheduleMapOptions?: ScheduleToTimelineDataMapOptions,
    height?: number,
    override?: Partial<Omit<TimelineProps, 'data' | 'height'>>
}

export default function ConfiguredTimeline(props: ConfiguredTimelineProps) {
    const now = useTime();
    const timelineConfig = useConfiguration(config => config.timeline);

    return (
        <Timeline
            data={mapScheduleToTimelineData(props.schedule, props.scheduleMapOptions)}
            height={props.height}
            currentTime={
                props.override?.currentTime ??
                now
            }
            startTime={
                props.override?.startTime ??
                timelineConfig.startTime
            }
            endTime={
                props.override?.endTime ??
                timelineConfig.endTime
            }
            automaticTimeBoundsOnOverflow={
                props.override?.automaticTimeBoundsOnOverflow ??
                timelineConfig.automaticTimeBoundsOnOverflow
            }
            amountOfSubTimeSteps={
                props.override?.amountOfSubTimeSteps ??
                timelineConfig.amountOfSubTimeSteps
            }
            amountOfTimeSteps={
                props.override?.amountOfTimeSteps ??
                timelineConfig.amountOfTimeSteps
            }
            marginSize={
                (
                    props.override?.marginSize ??
                    timelineConfig.marginSize
                ) / 2
            }
            automaticAmountOfTimeSteps={
                props.override?.automaticAmountOfTimeSteps ??
                timelineConfig.automaticAmountOfTimeSteps
            }
        />
    );
}
