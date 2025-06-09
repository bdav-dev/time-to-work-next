import TimelineTimeLabel from '@/components/timeline/module/components/TimelineTimeLabel';
import Time from "@/time/Time";
import TimelineBlockComponent from "@/components/timeline/module/components/TimelineBlock";
import TimelineMarkerComponent from "@/components/timeline/module/components/TimelineMarker";
import { TimelineCalculator } from "@/components/timeline/module/TimelineCalculator";
import React, { CSSProperties } from "react";
import { TimelineBlock, TimelineConfiguration, TimelineMarker } from "@/components/timeline/module/TimelineTypes";
import DefaultTimelineThemes from "@/components/timeline/module/DefaultTimelineThemes";
import { TimelineLine } from "@/components/timeline/module/components/TimelineLine";


export type TimelineProps = {
    blocks?: TimelineBlock[],
    markers?: TimelineMarker[],
    configuration: Partial<TimelineConfiguration>,
    className?: string,
    style?: CSSProperties
}

export default function Timeline({ blocks, markers, configuration, className, style }: TimelineProps) {
    const config: TimelineConfiguration = { ...DefaultTimelineConfiguration, ...configuration };

    const calculator = TimelineCalculator.withContext(config, blocks ?? []);
    const timeSteps = calculator.createTimeSteps();

    return (
        <div
            className={className}
            style={{
                position: "relative",
                height: config.height,
                marginBottom: '36px',
                marginTop: '33px',
                color: config.theme.textColor,
                backgroundImage: calculator.createTimelineBackgroundImageGradient(),
                borderRadius: '1.5rem',
                ...style
            }}
        >
            <div
                style={{
                    borderRadius: '1.5rem',
                    position: 'absolute',
                    overflow: 'hidden',
                    width: '100%',
                    height: '100%'
                }}
            >
                {
                    calculator.createSubTimeSteps()
                        .map((step, i) => <TimelineLine key={i} position={step.position} width={'1px'} color={config.theme.subTimeStepColor}/>)
                }
                {
                    timeSteps
                        .map((step, i) => <TimelineLine key={i} position={step.position} width={'2px'} color={config.theme.timeStepColor}/>)
                }
            </div>
            {
                timeSteps
                    .map((step, i) => <TimelineTimeLabel key={i} {...step}/>)
            }
            {
                calculator.createTimelineBlockProps()
                    .toSorted((a, b) => a.block.startTime.compareTo(b.block.startTime))
                    .map((block, i) => <TimelineBlockComponent key={i} {...block}/>)
            }
            {
                calculator.createTimelineMarkerProps(markers)
                    .map((marker, i) => <TimelineMarkerComponent key={i} {...marker}/>)
            }
        </div>
    );
}

const DefaultTimelineConfiguration: TimelineConfiguration = {
    startTime: Time.of(7, 0),
    endTime: Time.of(18, 0),
    marginSize: 3.5,
    amountOfTimeSteps: 12,
    amountOfSubTimeSteps: 3,
    automaticAmountOfTimeSteps: false,
    automaticTimeBoundsOnOverflow: true,
    theme: DefaultTimelineThemes.LIGHT,
    height: "8rem",
    defaultBlockHeight: 0.94,
    defaultMarkerHeight: 1.07
};
