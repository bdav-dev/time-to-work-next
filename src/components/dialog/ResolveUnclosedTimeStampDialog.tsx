import Dialog from "@/components/primitives/Dialog";
import { highlightBlock, Schedule, ScheduleModificationResult } from "@/schedule/Schedule";
import Button from "@/components/primitives/control/Button";
import TimePicker from "@/components/primitives/control/TimePicker";
import { useState } from "react";
import Time from "@/time/Time";
import Frame from "@/components/layout/Frame";
import ScheduleOperations from "@/schedule/ScheduleOperations";
import ScheduleCalculations from "@/schedule/ScheduleCalculations";
import Section from "@/components/layout/Section";
import useConfiguration from "@/hooks/configuration/UseConfiguration";
import TimeComponent from "@/components/time/Time";
import Settings from "@/components/settings/Settings";
import { DisplayableError } from "@/error/DisplayableError";
import TimeInterval from "@/time/TimeInterval";
import StatusIndicator from "@/components/misc/StatusIndicator";
import useSchedule from "@/hooks/UseSchedule";
import ConfiguredTimeline from "@/components/timeline/ConfiguredTimeline";

type ResolveUnclosedTimeStampDialogProps = {
    isOpen: boolean,
    onSubmit?: (schedule: Schedule) => void
}

type CloseOpenTimeStampResult = Required<Pick<ScheduleModificationResult, 'submissionSchedule'>> & ScheduleModificationResult & { isResolved: boolean };

export default function ResolveUnclosedTimeStampDialog(props: ResolveUnclosedTimeStampDialogProps) {
    const { schedule } = useSchedule();
    const workingTimeConfig = useConfiguration(config => config.workingTime);

    const simulatedNowTime = Time.ofString("24:00");
    const [timeStampCloseTime, setTimeStampCloseTime] = useState<Time>();

    const { submissionSchedule, error, timeline, isResolved } = (
        tryCloseTimeStamp(schedule, timeStampCloseTime, simulatedNowTime)
    );

    if (!workingTimeConfig.dailyWorkingTime || !workingTimeConfig.timeBalance) {
        return undefined;
    }

    function submit() {
        props.onSubmit?.(submissionSchedule);
    }

    return (
        <Dialog
            title={'Nicht geschlossener Zeitstempel'}
            isOpen={props.isOpen}
            onRequestClose={() => {}}
            showCloseButton={false}
            closableWithEscKey={false}
        >
            <Section className={'mt-5'}>
                Dein letzter Zeitplan enthält einen <span className={'font-bold'}>nicht geschlossenen Zeitstempel</span>.
                Dadurch kann der neue Zeitsaldo nicht bestimmt werden.
                <div className={'h-2'}/>
                Du kannst diesen <span className={'text-green-500 dark:text-green-400'}>Konflikt lösen</span>,
                in dem du eine Endzeit für den offenen Zeitstempel angibst.
                <div className={'h-1'}/>
                Alternativ kannst du den <span className={'text-red-500 dark:text-red-400'}>Zeitstempel verwerfen</span>.
                Dadurch wird der offene Zeitstempel nicht in der Berechnung für den neuen Zeitsaldo berücksichtigt.
            </Section>

            <ConfiguredTimeline
                schedule={timeline.previewSchedule}
                scheduleMapOptions={{
                    className: timeline.highlightBlock && highlightBlock(timeline.highlightBlock, !!error)
                }}
                override={{
                    showNowLine: false,
                    automaticTimeBoundsOnOverflow: !!timeStampCloseTime,
                }}
            />

            <Frame className={'my-5 flex items-center justify-center gap-2.5'}>
                Zeitstempel schließen:
                <TimePicker
                    value={timeStampCloseTime}
                    onValueChange={setTimeStampCloseTime}
                />
            </Frame>

            <Section className={'py-3.5 mt-4'}>
                <div className={'flex gap-2.5 items-center p-3.5'}>
                    <StatusIndicator
                        status={isResolved ? 'green' : error ? 'red' : 'yellow'}
                        text={{
                            'green': 'Konflikt gelöst',
                            'yellow': 'Konflikt nicht gelöst',
                            'red': `Fehler: ${error?.message}`
                        }}
                    />
                </div>
                <Settings
                    sections={[
                        {
                            settings: [
                                {
                                    label: 'Summe der Arbeitszeit',
                                    setting: <TimeComponent
                                        time={
                                            ScheduleCalculations.getSumOfWorkTime(
                                                submissionSchedule,
                                                simulatedNowTime
                                            )
                                        }
                                    />
                                },
                                {
                                    label: 'restliche Arbeitszeit',
                                    setting: <TimeComponent
                                        time={
                                            ScheduleCalculations.getRemainingTimeToWork(
                                                submissionSchedule,
                                                simulatedNowTime,
                                                workingTimeConfig.dailyWorkingTime
                                            )
                                        }
                                    />
                                },
                                {
                                    label: 'Zeitsaldo',
                                    setting: <TimeComponent
                                        showPositiveSign
                                        time={workingTimeConfig.timeBalance}
                                    />
                                },
                                {
                                    label: 'neuer Zeitsaldo',
                                    setting: <TimeComponent
                                        showPositiveSign
                                        time={
                                            ScheduleCalculations.getNewTimeBalance(
                                                submissionSchedule,
                                                simulatedNowTime,
                                                workingTimeConfig.dailyWorkingTime,
                                                workingTimeConfig.timeBalance
                                            )
                                        }
                                    />
                                }
                            ]
                        }
                    ]}
                />
            </Section>

            <div className={"flex justify-between gap-3 mt-7"}>
                <Button onClick={submit} className={'text-red-500 dark:text-red-400'} overrideMargin>
                    Zeitstempel verwerfen
                </Button>

                <Button
                    onClick={submit}
                    className={'text-green-500 dark:text-green-400'}
                    overrideMargin
                    disabled={!isResolved}
                >
                    Konflikt lösen
                </Button>
            </div>
        </Dialog>
    );
}

function tryCloseTimeStamp(
    schedule: Schedule,
    timeStampCloseTime: Time | undefined,
    simulatedNowTime: Time
): CloseOpenTimeStampResult {
    const openTimeStamp = ScheduleOperations.getOpenTimestamp(schedule);
    if (!openTimeStamp) {
        return {
            submissionSchedule: schedule,
            isResolved: true,
            timeline: { previewSchedule: schedule }
        };
    }

    const scheduleWithOpenTimeStampRemoved = ScheduleOperations.removeScheduleBlock(schedule, openTimeStamp);

    if (!timeStampCloseTime) {
        return {
            submissionSchedule: scheduleWithOpenTimeStampRemoved,
            isResolved: false,
            timeline: { previewSchedule: schedule, highlightBlock: openTimeStamp }
        };
    }

    const highlightBlock = { ...openTimeStamp, endTime: timeStampCloseTime };

    let timeInterval;
    try {
        timeInterval = TimeInterval.of(openTimeStamp.startTime, timeStampCloseTime);
    } catch (error) {
        return {
            submissionSchedule: scheduleWithOpenTimeStampRemoved,
            isResolved: false,
            error: DisplayableError.of('Die Endzeit liegt vor der Startzeit.'),
            timeline: { previewSchedule: scheduleWithOpenTimeStampRemoved, highlightBlock }
        };
    }

    try {
        const resolvedSchedule = ScheduleOperations.addTimeInterval(
            scheduleWithOpenTimeStampRemoved,
            simulatedNowTime,
            timeInterval,
            openTimeStamp.timeType
        );

        return {
            submissionSchedule: resolvedSchedule,
            isResolved: true,
            timeline: { previewSchedule: resolvedSchedule, highlightBlock }
        }
    } catch (error) {
        return {
            submissionSchedule: scheduleWithOpenTimeStampRemoved,
            isResolved: false,
            error: error instanceof DisplayableError ? error : DisplayableError.unknown(),
            timeline: {
                previewSchedule: [...scheduleWithOpenTimeStampRemoved, highlightBlock],
                highlightBlock: highlightBlock
            }
        };
    }
}
