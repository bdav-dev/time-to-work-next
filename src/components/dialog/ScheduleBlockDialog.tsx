import Dialog from "@/components/primitives/Dialog";
import Timeline from "@/components/timeline/Timeline";
import Time from "@/time/Time";
import { mapScheduleToTimelineData, Schedule, ScheduleBlock, scheduleBlockEquals } from "@/schedule/Schedule";
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

    function addTimeInterval(schedule: Schedule, startTime: Time, endTime: Time) {
        let timeInterval: TimeInterval;
        try {
            timeInterval = TimeInterval.of(startTime, endTime);
        } catch (e) {
            throw new DisplayableError('error creating time interval');
        }

        return ScheduleOperations.addTimeInterval(
            schedule,
            props.currentTime,
            timeInterval,
            selectedTimeType
        );
    }

    const schedulePreview = useMemo<SchedulePreview>(() => {
        let schedule = ScheduleOperations.removeScheduleBlock(props.schedule, props.block);

        if (!startTime) {
            return { schedule, error: new DisplayableError('Es ist keine Startzeit definiert.') };
        }

        const block: ScheduleBlock = { startTime, endTime, timeType: selectedTimeType };

        try {
            schedule = endTime
                ? addTimeInterval(schedule, startTime, endTime)
                : ScheduleOperations.openTimeStamp(
                    schedule,
                    startTime,
                    props.currentTime,
                    selectedTimeType
                );
        } catch (error) {
            if (error instanceof DisplayableError) {
                return { schedule: [...schedule, block], block, error };
            }
            return { schedule, error: DisplayableError.unknown() };
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
            <Timeline
                currentTime={props.currentTime}
                data={
                    mapScheduleToTimelineData(
                        schedulePreview.schedule,
                        { className: block => scheduleBlockEquals(block, schedulePreview.block) ? `${schedulePreview.error && 'border-2 border-red-500'}` : 'opacity-40' }
                    )
                }
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
                        <StatusIndicator status={schedulePreview.error ? 'red' : 'green'}/>
                        {
                            schedulePreview.error
                                ? 'Fehler'
                                : 'Bereit'
                        }
                    </div>
                    {
                        schedulePreview.error &&
                        <div>
                            {
                                schedulePreview.error.message
                            }
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
                    disabled={!!schedulePreview.error || scheduleBlockEquals(props.block, schedulePreview.block)}
                    onClick={() => !schedulePreview.error && props.onRequestSubmitSchedule?.(schedulePreview.schedule)}
                >
                    Speichern
                </Button>
            </div>
        </Dialog>
    );
}
