import Dialog from "@/components/control/Dialog";
import Timeline from "@/components/timeline/Timeline";
import Time from "@/time/Time";
import { mapScheduleToTimelineData, Schedule, ScheduleBlock, scheduleBlockEquals } from "@/schedule/Schedule";
import Button from "@/components/control/Button";
import React, { useEffect, useMemo, useState } from "react";
import TimePicker from "@/components/control/TimePicker";
import ScheduleOperations from "@/schedule/ScheduleOperations";
import SegmentedControls, { Segment } from "@/components/control/SegmentedControls";
import { ScheduleBlockTime, ScheduleBlockTimeIdentifier, ScheduleBlockTimes } from "@/schedule/ScheduleBlockTime";
import TimeInterval from "@/time/TimeInterval";


type ScheduleBlockDialogProps = {
    isOpen: boolean,
    onRequestClose: () => void,
    currentTime: Time,
    schedule: Schedule,
    block: ScheduleBlock,
    onRequestRemoveScheduleBlock?: (block: ScheduleBlock) => void
}


const ScheduleBlockTimeSegments: { [key in ScheduleBlockTimeIdentifier]: Segment<ScheduleBlockTime> } = {
    workTime: {
        id: 0,
        value: ScheduleBlockTimes.WORK,
        displayAs: ScheduleBlockTimes.WORK.segment.displayAs,
        className: isSelection => `${isSelection && ScheduleBlockTimes.WORK.segment.className}`
    },
    breakTime: {
        id: 1,
        value: ScheduleBlockTimes.BREAK,
        displayAs: ScheduleBlockTimes.BREAK.segment.displayAs,
        className: isSelection => `${isSelection && ScheduleBlockTimes.BREAK.segment.className}`
    }
};

export default function ScheduleBlockDialog(props: ScheduleBlockDialogProps) {
    const [startTime, setStartTime] = useState<Time | undefined>(props.block.startTime);
    const [endTime, setEndTime] = useState<Time | undefined>(props.block.endTime);

    const [selectedScheduleBlockTimeSegment, setSelectedScheduleBlockTimeSegment] = useState<Segment<ScheduleBlockTime>>(
        ScheduleBlockTimeSegments[props.block.time.identifier]
    );


    useEffect(() => {
        setStartTime(props.block.startTime);
        setEndTime(props.block.endTime);
    }, [props.block]);

    const displaySchedule: { schedule: Schedule, block?: ScheduleBlock } = useMemo(() => {
        const schedule = ScheduleOperations.removeScheduleBlock(props.schedule, props.block);

        const block = {
            startTime: startTime!,
            endTime: endTime,
            time: selectedScheduleBlockTimeSegment.value,
        };
        schedule.push(block);

        return { schedule, block };
    }, [startTime, endTime, selectedScheduleBlockTimeSegment]);

    const previewSchedule: Schedule | undefined = useMemo(() => {
        let schedule = ScheduleOperations.removeScheduleBlock(props.schedule, props.block);

        if (!startTime) {
            return undefined;
        }

        if (endTime) {
            try {
                schedule = ScheduleOperations.addTimeInterval(schedule, props.currentTime, TimeInterval.of(startTime, endTime), selectedScheduleBlockTimeSegment.value);
            } catch (e) {
                return undefined;
            }
        } else {
            try {
                schedule = ScheduleOperations.openTimeStamp(schedule, startTime, props.currentTime, selectedScheduleBlockTimeSegment.value);
            } catch (e) {
                return undefined;
            }
        }

        return schedule;
    }, [startTime, endTime, selectedScheduleBlockTimeSegment]);


    function
    remove() {
        const success = props.onRequestRemoveScheduleBlock?.(props.block!);

        if (success) {
            props.onRequestClose?.();
        }
    }

    return (
        <Dialog
            isOpen={props.isOpen}
            onRequestClose={props.onRequestClose}
        >

            <div className={'text-xl font-bold'}>
                {
                    props.block.endTime
                        ? 'Zeitintervall '
                        : 'Zeitstempel '
                }
                bearbeiten
            </div>

            <Timeline
                currentTime={props.currentTime}
                data={mapScheduleToTimelineData(displaySchedule.schedule, { className: block => block ? (scheduleBlockEquals(block, displaySchedule.block) ? '' : 'opacity-40') : '' }) }
                    height={7}
                    />
                    <div>
                    <TimePicker value={startTime} onValueChange={setStartTime}/>
            -
            <TimePicker value={endTime} onValueChange={setEndTime}/>
        </div>

    {
        // TODO here and schedulecontrolpanel: create component -> auslagern
    }
    <SegmentedControls
        segments={Object.values(ScheduleBlockTimeSegments)}
        selection={selectedScheduleBlockTimeSegment}
        onSelectionChange={segment => setSelectedScheduleBlockTimeSegment(segment!)}
        orientation={'horizontal'}
        segmentClassName={(isSelection) => `${isSelection && 'font-bold'}`}
        deselectable={false}
    />


    <div className={'flex justify-between gap-3 mt-8'}>
        <Button onClick={remove} overrideMargin className={'text-red-500 dark:text-red-400'}>
            Löschen
        </Button>

        <Button overrideMargin>
            Speichern
        </Button>
    </div>

</Dialog>

)
    ;


}