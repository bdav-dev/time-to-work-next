import Dialog from "@/components/primitives/Dialog";
import Time from "@/time/Time";
import { highlightBlock, ScheduleBlock, scheduleBlockEquals, ScheduleModificationResult } from "@/schedule/Schedule";
import Button from "@/components/primitives/control/Button";
import { useEffect, useMemo, useState } from "react";
import TimePicker from "@/components/primitives/control/TimePicker";
import ScheduleOperations from "@/schedule/ScheduleOperations";
import { ScheduleBlockTimeType } from "@/schedule/ScheduleBlockTimeType";
import TimeInterval from "@/time/TimeInterval";
import { DisplayableError } from "@/error/DisplayableError";
import ScheduleBlockTimeTypeSelect from "@/components/select/ScheduleBlockTimeTypeSelect";
import Section from "@/components/layout/section/Section";
import StatusIndicator from "@/components/misc/StatusIndicator";
import Frame from "@/components/layout/Frame";
import ConfiguredTimeline from "@/components/timeline/ConfiguredTimeline";
import { compare } from "@/util/CompareUtils";
import useSchedule from "@/hooks/UseSchedule";
import useTime from "@/hooks/UseTime";
import { SemanticKeys } from "@/shortcuts/SemanticKeys";
import ScheduleCalculations from "@/schedule/ScheduleCalculations";

type EditScheduleBlockDialogProps = {
    isOpen: boolean,
    onRequestClose: () => void,
    block: ScheduleBlock
}

export default function EditScheduleBlockDialog(props: EditScheduleBlockDialogProps) {
    const now = useTime();
    const { schedule, setSchedule } = useSchedule();

    const [startTime, setStartTime] = useState<Time | undefined>(props.block.startTime);
    const [endTime, setEndTime] = useState<Time | undefined>(props.block.endTime);
    const [selectedTimeType, setSelectedTimeType] = useState<ScheduleBlockTimeType>(props.block.timeType);

    useEffect(() => reset(), [props.block]);

    function reset() {
        setStartTime(props.block.startTime);
        setEndTime(props.block.endTime);
        setSelectedTimeType(props.block.timeType);
    }

    const { submissionSchedule, error, timeline } = useMemo<ScheduleModificationResult>(() => {
        let previewSchedule = ScheduleOperations.removeScheduleBlock(schedule, props.block);

        if (!startTime) {
            return {
                timeline: { previewSchedule },
                error: DisplayableError.of('Es ist keine Startzeit definiert.')
            };
        }
        if (endTime && compare(endTime, 'lessThan', startTime)) {
            return { timeline: { previewSchedule }, error: DisplayableError.of('Die Endzeit liegt vor der Startzeit.') };
        }

        const highlightBlock: ScheduleBlock = { startTime, endTime, timeType: selectedTimeType };
        try {
            previewSchedule = endTime
                ? ScheduleOperations.addTimeInterval(
                    previewSchedule,
                    now,
                    TimeInterval.of(startTime, endTime),
                    selectedTimeType
                )
                : ScheduleOperations.openTimeStamp(
                    previewSchedule,
                    startTime,
                    now,
                    selectedTimeType
                );
        } catch (error) {
            return error instanceof DisplayableError
                ? { timeline: { previewSchedule: [...previewSchedule, highlightBlock], highlightBlock }, error }
                : { timeline: { previewSchedule }, error: DisplayableError.unknown() }
        }

        return { submissionSchedule: previewSchedule, timeline: { previewSchedule, highlightBlock } };
    }, [startTime, endTime, selectedTimeType, schedule, now, props.block]);

    const isBlockUnmodified = scheduleBlockEquals(props.block, timeline.highlightBlock);
    const isReadyToSubmit = !error && !isBlockUnmodified;

    function closeAndRemoveBlock() {
        props.onRequestClose?.();
        setSchedule(schedule => ScheduleOperations.removeScheduleBlock(schedule, props.block));
    }

    function closeAndSaveBlock() {
        if (!isReadyToSubmit) {
            return;
        }

        props.onRequestClose?.();
        setSchedule(submissionSchedule!);
    }

    return (
        <Dialog
            isOpen={props.isOpen}
            onRequestClose={props.onRequestClose}
            title={`${props.block.endTime ? 'Zeitintervall' : 'Zeitstempel'} bearbeiten`}
            footer={
                <div className={'flex justify-between gap-3 w-full'}>
                    <Button onClick={closeAndRemoveBlock} overrideMargin className={'text-red-500 dark:text-red-400'}>
                        Löschen
                    </Button>

                    <Button
                        overrideMargin
                        disabled={!isReadyToSubmit}
                        onClick={closeAndSaveBlock}
                    >
                        Speichern
                    </Button>
                </div>
            }
        >
            <ConfiguredTimeline
                schedule={timeline.previewSchedule}
                scheduleMapOptions={{
                    className: timeline.highlightBlock && highlightBlock(timeline.highlightBlock, !!error)
                }}
                overrideConfiguration={{ height: "7rem" }}
            />

            <div className={'mt-5 flex gap-2.5 flex-col md:flex-row mb-1'}>
                <Frame overridePadding className={'flex-1 p-4 flex flex-col items-center justify-center gap-1.5 flex-wrap'}>
                    <div className={'flex flex-row gap-2.5 items-center'}>
                        <TimePicker
                            value={startTime}
                            onValueChange={setStartTime}
                            onKeyUp={{
                                [SemanticKeys.SET_TO_CURRENT_TIME]: { setValue: now },
                                [SemanticKeys.SET_TO_DEFAULT]: { setValue: props.block.startTime },
                                [SemanticKeys.SET_TO_ADJACENT]: { setValue: ScheduleCalculations.getLatestEndTime(timeline.previewSchedule, timeline.highlightBlock) },
                                [SemanticKeys.SUBMIT]: { run: closeAndSaveBlock },
                            }}
                        />
                        bis
                        <TimePicker
                            value={endTime}
                            onValueChange={setEndTime}
                            onKeyUp={{
                                [SemanticKeys.SET_TO_CURRENT_TIME]: { setValue: now },
                                [SemanticKeys.SET_TO_DEFAULT]: { setValue: props.block.endTime ?? null },
                                [SemanticKeys.SUBMIT]: { run: closeAndSaveBlock }
                            }}
                        />
                    </div>

                    <ScheduleBlockTimeTypeSelect
                        value={selectedTimeType}
                        onValueChange={setSelectedTimeType}
                    />
                </Frame>

                <Section className={'flex-1 flex flex-col gap-0.5'}>
                    <StatusIndicator
                        status={isBlockUnmodified ? 'yellow' : error ? 'red' : 'green'}
                        text={{
                            red: 'Fehler',
                            yellow: 'Keine Änderungen vorgenommen',
                            green: 'Bereit'
                        }}
                    />
                    {
                        error &&
                        <div>
                            {error.message}
                        </div>
                    }
                </Section>
            </div>
        </Dialog>
    )
        ;
}
