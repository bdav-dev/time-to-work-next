import Timeline, { TimelineProps } from "@/components/timeline/Timeline";
import useTime from "@/hooks/UseTime";
import useConfiguration from "@/hooks/configuration/UseConfiguration";
import { TimelineConfiguration } from "@/hooks/configuration/settings/UseTimelineConfiguration";


type ConfiguredTimelineProps = Omit<TimelineProps,
    'currentTime' |
    'startTime' |
    'endTime' |
    'dynamicStartAndEndTimes' |
    'amountOfSubTimeSteps' |
    'amountOfTimeSteps' |
    'offTimeSize'
>

export default function ConfiguredTimeline(props: ConfiguredTimelineProps) {
    const now = useTime();
    const timelineConfig = useConfiguration<TimelineConfiguration>(config => config.timeline);

    return (
        <Timeline
            currentTime={now}
            startTime={timelineConfig.startTime}
            endTime={timelineConfig.endTime}
            dynamicStartAndEndTimes={timelineConfig.automaticTimeBoundsIfOverflow}
            amountOfSubTimeSteps={timelineConfig.amountOfMinorTimeSteps}
            amountOfTimeSteps={timelineConfig.amountOfMajorTimeSteps}
            offTimeSize={timelineConfig.offTimeSize / 2}
            automaticTimeBoundsAndTimeStepsIfOverflow={timelineConfig.automaticTimeBoundsIfOverflow}
            automaticTimeSteps={timelineConfig.automaticAmountOfMajorTimeSteps}
            {...props}
        />
    );
}
