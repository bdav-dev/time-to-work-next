import TimeComponent from "@/components/time/Time";
import { VerifiedPublicTransitConfiguration } from "@/hooks/configuration/instances/UsePublicTransitConfiguration";
import PublicTransitCalculations from "@/publicTransit/PublicTransitCalculations";
import Time from "@/time/Time";
import TimeSpan from "@/time/TimeSpan";
import { ReactNode } from "react";
import { compare } from "@/util/CompareUtils";
import { MaterialSymbols } from "@/icon/MaterialSymbols";
import MaterialSymbol from "@/components/icon/MaterialSymbol";
import Arrow from "@/components/misc/Arrow";


type PublicTransitInformationBoardProps = {
    config: VerifiedPublicTransitConfiguration,
    now: Time,
    className?: string
}

export default function PublicTransitInformationBoard(props: PublicTransitInformationBoardProps) {
    const {
        nextDeparture,
        timeUntilNextDeparture,
        leaveTime,
        timeUntilLeave
    } = PublicTransitCalculations.calculatePublicTransitInformation(props.config, props.now);

    const humanSymbol = (
        timeUntilLeave && compare(timeUntilLeave, 'lessThan', TimeSpan.empty())
            ? MaterialSymbols.DIRECTIONS_RUN
            : MaterialSymbols.DIRECTIONS_WALK
    );

    return (
        <div className={`w-fit flex flex-row items-center ${props.className}`}>
            {
                props.config.travelTime &&
                <>
                    <TimeEvent
                        icon={<MaterialSymbol symbol={humanSymbol} opticalSize={"40px"} className={"size-8 mr-0.5"}/>}
                        atTime={leaveTime}
                        timeRemaining={timeUntilLeave}
                    />
                    <Arrow className={"mx-3"}>
                        <TimeComponent time={props.config.travelTime} className={'text-sm leading-none'}/>
                    </Arrow>
                </>
            }
            <TimeEvent
                icon={<MaterialSymbol symbol={props.config.type.icon} opticalSize={"40px"} className={'size-8 mr-1'}/>}
                atTime={nextDeparture}
                timeRemaining={timeUntilNextDeparture}
            />
        </div>
    );
}

function TimeEvent({ icon, atTime, timeRemaining }: { icon: ReactNode, atTime?: Time, timeRemaining?: TimeSpan }) {
    return (
        <>
            {icon}
            <div className={'flex flex-col'}>
                <TimeComponent time={atTime} className={'text-left font-bold leading-5'}/>
                <span className={`font-[350] leading-5`}>
                    <TimeRemaining timeRemaining={timeRemaining}/>
                </span>
            </div>
        </>
    );
}

function TimeRemaining({ timeRemaining }: { timeRemaining: TimeSpan | undefined }): ReactNode {
    if (!timeRemaining) {
        return <TimeComponent time={undefined}/>;
    }

    if (compare(timeRemaining, 'lessThan', TimeSpan.empty())) {
        return (
            <span className={'text-red-700 dark:text-red-300'}>
                seit <TimeComponent time={timeRemaining.absolute()}/>
            </span>
        );
    }
    if (compare(timeRemaining, 'equal', TimeSpan.empty())) {
        return (
            <span className={'text-red-700 dark:text-red-300'}>
                Jetzt
            </span>
        );
    }
    if (compare(timeRemaining, 'lessOrEqualThan', TimeSpan.ofMinutes(5))) {
        return (
            <span className={'text-yellow-700 dark:text-yellow-300'}>
                in <TimeComponent time={timeRemaining}/>
            </span>
        );
    }

    return <>in <TimeComponent time={timeRemaining}/></>;
}
