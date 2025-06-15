import Timeline from "@/components/timeline/module/Timeline";
import useTime from "@/hooks/UseTime";
import useConfiguration from "@/hooks/configuration/UseConfiguration";
import { mapScheduleToTimelineData, Schedule, ScheduleToTimelineDataMapOptions } from "@/schedule/Schedule";
import { TimelineConfiguration, TimelineMarker } from "@/components/timeline/module/TimelineTypes";
import { useTheme } from "@/hooks/UseTheme";
import DefaultTimelineThemes from "@/components/timeline/module/DefaultTimelineThemes";
import { TimelineBlockContent } from "@/components/timeline/TimelineBlockContent";
import NeumorphicDiv from "@/components/primitives/neumorphic/NeumorphicDiv";
import { NeumorphicBlueprintFactory } from "@/neumorphic/NeumorphicStyle";
import { TimelineMarkerColors } from "@/components/timeline/TimelineColors";

type ConfiguredTimelineProps = {
    schedule: Schedule,
    markers?: TimelineMarker[],
    scheduleMapOptions?: ScheduleToTimelineDataMapOptions,
    overrideConfiguration?: Partial<TimelineConfiguration>,
    overrideMargin?: { top?: string, bottom?: string }
    showCurrentTimeMarker?: boolean
}

export default function ConfiguredTimeline({ showCurrentTimeMarker = true, ...props }: ConfiguredTimelineProps) {
    const now = props.overrideConfiguration?.currentTime ?? useTime();
    const { darkTheme } = useTheme();
    const timelineConfig = useConfiguration(config => config.timeline);

    const defaultConfigurationOverride = {
        theme: darkTheme ? DefaultTimelineThemes.DARK : DefaultTimelineThemes.LIGHT,
        currentTime: now,
        startTime: timelineConfig.startTime,
        endTime: timelineConfig.endTime,
        automaticTimeBoundsOnOverflow: timelineConfig.automaticTimeBoundsOnOverflow,
        amountOfSubTimeSteps: timelineConfig.amountOfSubTimeSteps,
        amountOfTimeSteps: timelineConfig.amountOfTimeSteps,
        marginSize: timelineConfig.marginSize / 2,
        automaticAmountOfTimeSteps: timelineConfig.automaticAmountOfTimeSteps
    };

    return (
        <NeumorphicDiv
            blueprint={NeumorphicBlueprintFactory.createLarge()}
            className={"rounded-3xl"}
            style={{ marginBottom: props.overrideMargin?.bottom ?? '36px', marginTop: props.overrideMargin?.top ?? '33px' }}
        >
            <Timeline
                style={{ margin: 0 }}
                blocks={mapScheduleToTimelineData(props.schedule, now, TimelineBlockContent, props.scheduleMapOptions)}
                markers={
                    [
                        ...props.markers ?? [],
                        ...showCurrentTimeMarker ? [{ title: "Jetzt", time: now, color: TimelineMarkerColors.RED }] : [],
                    ]
                }
                configuration={{
                    ...defaultConfigurationOverride,
                    ...props.overrideConfiguration
                }}
            />
        </NeumorphicDiv>
    );
}
