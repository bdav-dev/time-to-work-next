import Timeline from "@/components/timeline/Timeline";
import useTime from "@/hooks/UseTime";
import useConfiguration from "@/hooks/configuration/UseConfiguration";
import { mapScheduleToTimelineData, Schedule, ScheduleToTimelineDataMapOptions } from "@/schedule/Schedule";


type ConfiguredTimelineProps = {
    schedule: Schedule,
    scheduleMapOptions?: ScheduleToTimelineDataMapOptions,
    height?: number
}

export default function ConfiguredTimeline(props: ConfiguredTimelineProps) {
    const now = useTime();
    const timelineConfig = useConfiguration(config => config.timeline);

    return (
        <Timeline
            data={mapScheduleToTimelineData(props.schedule, props.scheduleMapOptions)}
            height={props.height}
            currentTime={now}
            startTime={timelineConfig.startTime}
            endTime={timelineConfig.endTime}
            dynamicStartAndEndTimes={timelineConfig.automaticTimeBoundsIfOverflow}
            amountOfSubTimeSteps={timelineConfig.amountOfMinorTimeSteps}
            amountOfTimeSteps={timelineConfig.amountOfMajorTimeSteps}
            offTimeSize={timelineConfig.offTimeSize / 2}
            automaticTimeBoundsAndTimeStepsIfOverflow={timelineConfig.automaticTimeBoundsIfOverflow}
            automaticTimeSteps={timelineConfig.automaticAmountOfMajorTimeSteps}
        />
    );
}
