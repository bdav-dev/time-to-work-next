import { ScheduleBlock } from "@/schedule/Schedule";
import Time from "@/time/Time";
import MaterialSymbol from "@/components/icon/MaterialSymbol";
import { MaterialSymbols } from "@/icon/MaterialSymbols";
import TimeSpan from "@/time/TimeSpan";

export function TimelineBlockContent(props: { scheduleBlock: ScheduleBlock, now: Time }) {

    return (
        <div className={'flex flex-col text-left h-full p-2.5 text-white fill-white'}>

            <div className={'overflow-hidden text-ellipsis leading-5'}>
                {props.scheduleBlock.timeType.timelineBlock.title}
            </div>

            <div className={'absolute bottom-0 left-1/2 -translate-x-1/2 rounded-lg z-10 py-0.5 px-1.5 mb-1.5'}
                 style={{
                     backgroundColor: props.scheduleBlock.timeType.timelineBlock.color.labelBackground,
                     fontSize: 'clamp(0px, 2vw, 0.8125rem)'
                 }}
            >
                <div>
                    {props.scheduleBlock.startTime.toString()}
                    <span className={'mx-0.5'}>-</span>
                    {props.scheduleBlock.endTime?.toString() ?? '...'}
                </div>

                <div className={'flex flex-row gap-[1px] justify-center items-center'}>
                    <MaterialSymbol
                        symbol={MaterialSymbols.TIMER}
                        opticalSize={"20px"}
                        style={{ width: 'clamp(0px, 2vw, 1.05rem)', height: 'clamp(0px, 2vw, 1.05rem)' }}
                    />
                    {TimeSpan.ofTimeDifference(props.scheduleBlock.startTime, props.scheduleBlock.endTime ?? props.now).toString()}
                </div>
            </div>
        </div>
    );
}
