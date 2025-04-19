import Toggle from "@/components/primitives/control/Toggle";
import Settings from "@/components/settings/Settings";
import TimePicker from "@/components/primitives/control/TimePicker";
import useMutatingConfigurationValue from "@/hooks/configuration/UseMutatingConfigurationValue";
import useMutatingConfigurationValueWithFallback from "@/hooks/configuration/UseMutatingConfigurationValueWithFallback";
import { DefaultPublicTransitConfiguration, useVerifiedPublicTransitConfiguration } from "@/hooks/configuration/instances/UsePublicTransitConfiguration";
import PublicTransitInformationBoard from "@/components/publicTransit/PublicTransitInformationBoard";
import useTime from "@/hooks/UseTime";
import Section from "@/components/layout/Section";
import TimeSpan from "@/time/TimeSpan";
import PublicTransitTypeSelect from "@/components/select/PublicTransitTypeSelect";

export default function PublicTransitSettings() {
    const now = useTime();
    const publicTransitConfig = useVerifiedPublicTransitConfiguration();

    const [isPublicTransitFeatureEnabled, setIsPublicTransitFeatureEnabled] = (
        useMutatingConfigurationValue(config => config.publicTransit.isPublicTransitFeatureEnabled)
    );
    const [startTime, setStartTime] = useMutatingConfigurationValueWithFallback(
        config => config.publicTransit.startTime,
        DefaultPublicTransitConfiguration.startTime
    );
    const [period, setPeriod] = useMutatingConfigurationValueWithFallback(
        config => config.publicTransit.period,
        DefaultPublicTransitConfiguration.period
    );
    const [travelTime, setTravelTime] = useMutatingConfigurationValue(
        config => config.publicTransit.travelTime
    );
    const [gracePeriod, setGracePeriod] = useMutatingConfigurationValueWithFallback(
        config => config.publicTransit.gracePeriod,
        DefaultPublicTransitConfiguration.gracePeriod
    );
    const [type, setType] = useMutatingConfigurationValue(config => config.publicTransit.type);

    const isPeriodInvalid = period.equals(TimeSpan.of(0, 0));

    return (
        <div>
            <div className={'flex flex-col items-center justify-center gap-1'}>
                Rückfahrt von Arbeitsplatz mit öffentlichen Verkehrsmitteln
                <Toggle
                    value={isPublicTransitFeatureEnabled}
                    onValueChange={setIsPublicTransitFeatureEnabled}
                    customLabels={{ true: 'JA', false: 'NEIN' }}
                />
            </div>

            <Settings
                settingSections={[
                    {
                        title: 'Allgemein',
                        settings: [
                            {
                                label: 'Typ',
                                setting: disabled => <PublicTransitTypeSelect
                                    value={type}
                                    onValueChange={setType}
                                    disabled={disabled}
                                />,
                                disabled: !isPublicTransitFeatureEnabled
                            }
                        ]
                    },
                    {
                        title: 'Zeitplan',
                        settings: [
                            {
                                label: "Startzeitpunkt",
                                setting: disabled => <TimePicker
                                    value={startTime}
                                    onValueChange={val => setStartTime(val!)}
                                    disabled={disabled}
                                />,
                                disabled: !isPublicTransitFeatureEnabled
                            },
                            {
                                label: "Periode",
                                setting: disabled => <TimePicker
                                    value={period.asTime()}
                                    onValueChange={period => setPeriod(period?.asTimeSpan())}
                                    disabled={disabled}
                                    invalid={isPublicTransitFeatureEnabled && isPeriodInvalid}
                                />,
                                disabled: !isPublicTransitFeatureEnabled
                            }
                        ]
                    },
                    {
                        title: 'Wegzeit',
                        settings: [
                            {
                                label: "Wegzeit",
                                setting: disabled => <TimePicker
                                    value={travelTime?.asTime()}
                                    onValueChange={travelTime => setTravelTime(travelTime?.asTimeSpan())}
                                    disabled={disabled}
                                />,
                                disabled: !isPublicTransitFeatureEnabled
                            },
                            {
                                label: 'Grace period', // TODO: translate correctly
                                setting: disabled => <TimePicker
                                    value={gracePeriod?.asTime()}
                                    onValueChange={gracePeriod => setGracePeriod(gracePeriod?.asTimeSpan())}
                                    disabled={disabled}
                                />,
                                tooltip: "TODO", // TODO: write tooltip
                                disabled: !isPublicTransitFeatureEnabled || !travelTime
                            }
                        ]
                    },
                    {
                        settings: [
                            {
                                label: 'Vorschau',
                                setting: disabled => (
                                    publicTransitConfig
                                        ? <Section className={'w-fit'}>
                                            <PublicTransitInformationBoard config={publicTransitConfig} now={now}/>
                                        </Section>
                                        : <span className={`italic ${disabled && 'opacity-60'}`}>Nicht verfügbar</span>
                                ),
                                disabled: !isPublicTransitFeatureEnabled
                            }
                        ]
                    }
                ]}
            />
        </div>
    );

}
