import TimeLabel from '@/components/timeline/components/TimeLabel';
import ThickLine from '@/components/timeline/components/lines/ThickLine';
import ThinLine from '@/components/timeline/components/lines/ThinLine';
import NowLine from '@/components/timeline/components/lines/NowLine';
import { useTheme } from "@/hooks/UseTheme";
import Time from "@/time/Time";
import TimelineBlock from "@/components/timeline/components/TimelineBlock";
import { TimelineCalculator } from "@/components/timeline/TimelineCalculator";
import { TimelineBlockColor } from "@/components/timeline/TimelineBlockColor";
import NeumorphicDiv from "@/components/primitives/neumorphic/NeumorphicDiv";
import { NeumorphicBlueprintFactory } from "@/neumorphic/NeumorphicStyle";

export type TimelineData = {
    startTime: Time,
    endTime?: Time,
    title?: string,
    color?: TimelineBlockColor,
    className?: string,
    onClick?: () => void
};

export type TimelineProps = {
    height?: number,
    data: TimelineData[],
    currentTime: Time,
    dynamicStartAndEndTimes?: boolean,
    startTime?: Time,
    endTime?: Time,
    offTimeSize?: number,
    amountOfTimeSteps?: number,
    amountOfSubTimeSteps?: number,
    automaticTimeSteps?: boolean,
    automaticTimeBoundsAndTimeStepsIfOverflow?: boolean
}
// TODO: make automaticTimeSteps and automaticTimeBoundsAndTimeStepsIfOverflow NAMING consistent in whole codebase

export default function Timeline(props: TimelineProps) {
    const { darkTheme } = useTheme();

    const height = props.height ?? 8;

    const calculator = new TimelineCalculator({
        startTime: props.startTime ?? Time.ofString('07:00'),
        endTime: props.endTime ?? Time.ofString('18:00'),
        offTimeSize: props.offTimeSize ?? 3.5,
        amountOfTimeSteps: props.amountOfTimeSteps ?? 12,
        amountOfSubTimeSteps: props.amountOfSubTimeSteps ?? 3,
        data: props.data,
        currentTime: props.currentTime,
        automaticTimeSteps: props.automaticTimeSteps ?? false,
        automaticTimeBoundsAndTimeStepsIfOverflow: props.automaticTimeBoundsAndTimeStepsIfOverflow ?? true
    });

    const subTimeSteps = calculator.createSubTimeSteps();
    const timeSteps = calculator.createTimeSteps();
    const blockBlueprints = calculator.createTimelineBlockBlueprints(props.data, props.currentTime, darkTheme);

    return (
        <NeumorphicDiv
            blueprint={NeumorphicBlueprintFactory.createLarge()}
            className={'rounded-3xl relative'}
            style={{
                backgroundImage: calculator.createTimelineBackgroundImageGradient(darkTheme ? '#27282b' : '#d1d4d7'),
                height: `${height}rem`,
                marginBottom: '36px',
                marginTop: '33px',
            }}
        >
            <div className={'absolute rounded-3xl overflow-hidden w-full h-full'}>
                {
                    subTimeSteps.map((step, i) => <ThinLine key={i} position={step.position}/>)
                }
                {
                    timeSteps.map((step, i) => <ThickLine key={i} position={step.position}/>)
                }
            </div>
            {
                timeSteps.map((step, i) => <TimeLabel key={i} {...step}/>)
            }
            {
                blockBlueprints.map((block, i) => <TimelineBlock key={i} {...block}/>)
            }
            {
                calculator.isCurrentTimeInsideActiveArea(props.currentTime) &&
                <NowLine position={calculator.calculateNowLinePosition(props.currentTime)}/>
            }
        </NeumorphicDiv>
    );
}
