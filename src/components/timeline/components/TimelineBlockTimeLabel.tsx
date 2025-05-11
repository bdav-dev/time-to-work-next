import TimeSpan from "@/time/TimeSpan";
import Time from "@/time/Time";
import { ColorPair } from "@/color/Color";
import { MaterialSymbols } from "@/icon/MaterialSymbols";
import MaterialSymbol from "@/components/icon/MaterialSymbol";


type TimelineBlockTimeLabelProps = {
    className?: string,
    startTime: Time,
    endTime: Time,
    isOpen: boolean,
    color: ColorPair
}

export default function TimelineBlockTimeLabel(props: TimelineBlockTimeLabelProps) {

    return (
        <div
            className={`
                ${props.className}
                px-1.5 py-0.5 mb-1.5
                rounded-lg
                select-none
                z-10
            `}
            style={{
                backgroundColor: props.color.background,
                color: props.color.text,
                fontSize: 'clamp(0px, 2vw, 0.8125rem)'
            }}
        >
            <div>
                {props.startTime.toString()}
                <span className={'mx-0.5'}>-</span>
                {props.isOpen ? '...' : props.endTime.toString()}
            </div>

            <div className={'flex flex-row gap-[1px] justify-center items-center'}>
                <MaterialSymbol
                    symbol={MaterialSymbols.TIMER}
                    opticalSize={"20px"}
                    className={'fill-white'}
                    style={{ width: 'clamp(0px, 2vw, 1.05rem)', height: 'clamp(0px, 2vw, 1.05rem)' }}
                />
                {TimeSpan.ofTimeDifference(props.startTime, props.endTime).toString()}
            </div>
        </div>
    );

}
