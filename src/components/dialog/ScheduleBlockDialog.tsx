import Dialog from "@/components/primitives/Dialog";
import Time from "@/time/Time";
import { Schedule, ScheduleBlock, scheduleBlockEquals } from "@/schedule/Schedule";
import Button from "@/components/primitives/control/Button";
import React, { useEffect, useMemo, useState } from "react";
import TimePicker from "@/components/primitives/control/TimePicker";
import ScheduleOperations from "@/schedule/ScheduleOperations";
import { ScheduleBlockTimeType } from "@/schedule/ScheduleBlockTimeType";
import TimeInterval from "@/time/TimeInterval";
import { DisplayableError } from "@/error/DisplayableError";
import ScheduleBlockTimeTypeSelect from "@/components/control/select/ScheduleBlockTimeTypeSelect";
import Section from "@/components/layout/Section";
import StatusIndicator from "@/components/StatusIndicator";
import Frame from "@/components/layout/Frame";
import ConfiguredTimeline from "@/components/control/ConfiguredTimeline";
import { compare } from "@/util/CompareUtils";


type SchedulePreview = {
    schedule: Schedule,
    block?: ScheduleBlock,
    error?: DisplayableError
};

type ScheduleBlockDialogProps = {
    isOpen: boolean,
    onRequestClose: () => void,
    currentTime: Time,
    schedule: Schedule,
    block: ScheduleBlock,
    onRequestRemoveScheduleBlock?: (block: ScheduleBlock) => void,
    onRequestSubmitSchedule?: (schedule: Schedule) => void,
}

export default function ScheduleBlockDialog(props: ScheduleBlockDialogProps) {
    const [startTime, setStartTime] = useState<Time | undefined>(props.block.startTime);
    const [endTime, setEndTime] = useState<Time | undefined>(props.block.endTime);
    const [selectedTimeType, setSelectedTimeType] = useState<ScheduleBlockTimeType>(props.block.timeType);

    useEffect(() => {
        reset();
    }, [props.block]);

    function reset() {
        setStartTime(props.block.startTime);
        setEndTime(props.block.endTime);
        setSelectedTimeType(props.block.timeType);
    }

    const preview = useMemo<SchedulePreview>(() => {
        let schedule = ScheduleOperations.removeScheduleBlock(props.schedule, props.block);

        if (!startTime) {
            return { schedule, error: DisplayableError.of('Es ist keine Startzeit definiert.') };
        }
        if (endTime && compare(endTime, 'lessThan', startTime)) {
            return { schedule, error: DisplayableError.of('Die Endzeit liegt vor der Startzeit.') };
        }

        const block: ScheduleBlock = { startTime, endTime, timeType: selectedTimeType };
        try {
            schedule = endTime
                ? ScheduleOperations.addTimeInterval(
                    schedule,
                    props.currentTime,
                    TimeInterval.of(startTime, endTime),
                    selectedTimeType
                )
                : ScheduleOperations.openTimeStamp(
                    schedule,
                    startTime,
                    props.currentTime,
                    selectedTimeType
                );
        } catch (error) {
            return error instanceof DisplayableError
                ? { schedule: [...schedule, block], block, error }
                : { schedule, error: DisplayableError.unknown() };
        }

        return { schedule, block };
    }, [startTime, endTime, selectedTimeType]);

    function remove() {
        const success = props.onRequestRemoveScheduleBlock?.(props.block);
        if (success) {
            props.onRequestClose?.();
        }
    }

    return (
        <Dialog
            isOpen={props.isOpen}
            onRequestClose={props.onRequestClose}
            title={(props.block.endTime ? 'Zeitintervall' : 'Zeitstempel') + ' bearbeiten'}
        >
            <ConfiguredTimeline
                schedule={preview.schedule}
                scheduleMapOptions={{
                    className: block => scheduleBlockEquals(block, preview.block) ? `${preview.error && 'border-2 border-red-500'}` : 'opacity-40'
                }}
                height={7}
            />

            <div className={'mt-5 flex gap-2.5 flex-col md:flex-row'}>
                <Frame overridePadding className={'flex-1 p-4 flex flex-col items-center justify-center gap-1.5 flex-wrap'}>
                    <div className={'flex flex-row gap-2.5 items-center'}>
                        <TimePicker value={startTime} onValueChange={setStartTime}/>
                        bis
                        <TimePicker value={endTime} onValueChange={setEndTime}/>
                    </div>

                    <ScheduleBlockTimeTypeSelect
                        value={selectedTimeType}
                        onValueChange={setSelectedTimeType}
                    />
                </Frame>

                <Section className={'flex-1 flex flex-col gap-0.5'}>
                    <div className={'flex flex-row gap-2 items-center font-bold'}>
                        <StatusIndicator status={preview.error ? 'red' : 'green'}/>
                        {
                            preview.error
                                ? 'Fehler'
                                : 'Bereit'
                        }
                    </div>
                    {
                        preview.error &&
                        <div>
                            {preview.error.message}
                        </div>
                    }
                </Section>
            </div>


            <div className={'flex justify-between gap-3 mt-8'}>
                <Button onClick={remove} overrideMargin className={'text-red-500 dark:text-red-400'}>
                    Löschen
                </Button>

                <Button
                    overrideMargin
                    disabled={!!preview.error || scheduleBlockEquals(props.block, preview.block)}
                    onClick={() => !preview.error && props.onRequestSubmitSchedule?.(preview.schedule)}
                >
                    Speichern
                </Button>
            </div>
        </Dialog>
    );
}
