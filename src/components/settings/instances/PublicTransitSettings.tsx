import Toggle from "@/components/primitives/control/Toggle";
import Settings from "@/components/settings/Settings";
import TimePicker from "@/components/primitives/control/TimePicker";
import useMutatingConfigurationValue from "@/hooks/configuration/UseMutatingConfigurationValue";
import useMutatingConfigurationValueWithFallback from "@/hooks/configuration/UseMutatingConfigurationValueWithFallback";
import { DefaultPublicTransitConfiguration, useVerifiedPublicTransitConfiguration } from "@/hooks/configuration/instances/UsePublicTransitConfiguration";
import PublicTransitInformationBoard from "@/components/publicTransit/PublicTransitInformationBoard";
import useTime from "@/hooks/UseTime";
import Section from "@/components/layout/section/Section";
import TimeSpan from "@/time/TimeSpan";
import PublicTransitTypeSelect from "@/components/select/PublicTransitTypeSelect";
import { compare } from "@/util/CompareUtils";
import { SemanticKeys } from "@/shortcuts/SemanticKeys";
import TimeSpanPicker from "@/components/primitives/control/TimeSpanPicker";

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
        TimeSpan.empty()
    );
    const [type, setType] = useMutatingConfigurationValue(config => config.publicTransit.type);

    const isPeriodInvalid = period.equals(TimeSpan.empty());

    function rectifyGracePeriod(gracePeriodInput?: TimeSpan) {
        if (!gracePeriodInput) {
            return undefined;
        }

        const clampValue = TimeSpan.ofMinutes(59);
        return (
            compare(gracePeriodInput, 'greaterThan', clampValue)
                ? clampValue
                : gracePeriodInput
        );
    }

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
                sections={[
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
                                label: 'Startzeitpunkt',
                                setting: disabled => <TimePicker
                                    value={startTime}
                                    onValueChange={val => setStartTime(val!)}
                                    disabled={disabled}
                                />,
                                tooltip: <>
                                    Beispiel: Beginnt der Fahrplan um 06:04,
                                    trage <span className={'underline'}>06:04</span> ein.
                                </>,
                                disabled: !isPublicTransitFeatureEnabled
                            },
                            {
                                label: "Periode",
                                setting: disabled => <TimeSpanPicker
                                    value={period}
                                    onValueChange={setPeriod}
                                    disabled={disabled}
                                    invalid={isPublicTransitFeatureEnabled && isPeriodInvalid}
                                />,
                                tooltip: <>
                                    Hier gibst du an, in welchem Intervall dein Zug regelmäßig kommt.
                                    Beispiel: Wenn der Zug z.B. jeden Tag um 14:04, 14:34, 15:04, ... abfährt,
                                    trägst du hier 00:30 ein.
                                </>,
                                disabled: !isPublicTransitFeatureEnabled
                            }
                        ]
                    },
                    {
                        title: 'Wegzeit',
                        settings: [
                            {
                                label: "Wegzeit",
                                setting: disabled => <TimeSpanPicker
                                    value={travelTime}
                                    onValueChange={setTravelTime}
                                    disabled={disabled}
                                />,
                                tooltip: <>
                                    Trage hier ein, wie lange du benötigst, um von deinem Arbeitsplatz zum Bahnhof zu gelangen
                                </>,
                                disabled: !isPublicTransitFeatureEnabled
                            },
                            {
                                label: 'Grace period', // TODO: translate correctly
                                setting: disabled => <TimeSpanPicker
                                    value={gracePeriod}
                                    onValueChange={gracePeriod => setGracePeriod(rectifyGracePeriod(gracePeriod))}
                                    onKeyUp={{
                                        [SemanticKeys.SET_TO_DEFAULT]: { setValue: DefaultPublicTransitConfiguration.gracePeriod.asTime() }
                                    }}
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
