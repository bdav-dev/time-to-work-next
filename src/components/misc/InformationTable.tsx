import Section from "@/components/layout/Section";
import TimeComponent from "@/components/time/Time";
import ScheduleCalculations from "@/schedule/ScheduleCalculations";
import PublicTransitInformationBoard from "@/components/publicTransit/PublicTransitInformationBoard";
import Table from "@/components/layout/Table";
import useConfiguration from "@/hooks/configuration/UseConfiguration";
import { useVerifiedPublicTransitConfiguration } from "@/hooks/configuration/instances/UsePublicTransitConfiguration";
import useSchedule from "@/hooks/UseSchedule";
import useTime from "@/hooks/UseTime";
import TimeBalanceInformationBoard from "@/components/timeBalance/TimeBalanceInformationBoard";

export default function InformationTable() {
    const workingTimeConfig = useConfiguration(config => config.workingTime);
    const publicTransitConfig = useVerifiedPublicTransitConfiguration();
    const { schedule } = useSchedule();
    const now = useTime();

    return (
        <Table
            header={[
                'Summe der Arbeitszeit',
                workingTimeConfig.dailyWorkingTime ? 'restliche Arbeitszeit' : undefined,
                workingTimeConfig.dailyWorkingTime ? 'Arbeitsende' : undefined,
                workingTimeConfig.timeBalance ? 'Zeitsaldo' : undefined,
                'Pause',
                publicTransitConfig?.type.nextDepartureText
            ]}
            data={[
                [
                    <Section>
                        <TimeComponent time={ScheduleCalculations.getSumOfWorkTime(schedule, now)}/>
                    </Section>,
                    workingTimeConfig.dailyWorkingTime &&
                    <Section>
                        <TimeComponent time={ScheduleCalculations.getRemainingTimeToWork(schedule, now, workingTimeConfig.dailyWorkingTime)}/>
                    </Section>,
                    workingTimeConfig.dailyWorkingTime &&
                    <Section>
                        <TimeComponent time={ScheduleCalculations.getEndOfWork(schedule, now, workingTimeConfig.dailyWorkingTime)}/>
                    </Section>,
                    workingTimeConfig.timeBalance &&
                    <Section className={'flex justify-center'}>
                        <TimeBalanceInformationBoard
                            config={workingTimeConfig}
                            schedule={schedule}
                            now={now}
                        />
                    </Section>,
                    <Section>
                        <TimeComponent time={ScheduleCalculations.getSumOfBreakTime(schedule, now)}/>
                    </Section>,
                    publicTransitConfig &&
                    <Section className={'flex justify-center'}>
                        <PublicTransitInformationBoard config={publicTransitConfig} now={now}/>
                    </Section>
                ]
            ]}
        />

    );
}