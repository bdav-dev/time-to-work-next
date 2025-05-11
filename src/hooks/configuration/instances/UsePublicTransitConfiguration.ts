import Time from "@/time/Time";
import TimeSpan from "@/time/TimeSpan";
import { convertConfigurationToReadWriteConfiguration } from "@/contexts/ConfigurationContext";
import useStateWithLocalStorage from "@/hooks/UseStateWithLocalStorage";
import useConfiguration from "@/hooks/configuration/UseConfiguration";
import { createSerialization, Serialization } from "@/serialization/Serialization";
import { PublicTransitType, PublicTransitTypes } from "@/publicTransit/PublicTransitType";
import { ReadWriteConfiguration } from "@/configuration/Configuration";


export type PublicTransitConfiguration = {
    isPublicTransitFeatureEnabled: boolean,
    type: PublicTransitType,
    startTime: Time,
    period: TimeSpan,
    travelTime: TimeSpan | undefined,
    gracePeriod: TimeSpan
}

export type VerifiedPublicTransitConfiguration = Omit<PublicTransitConfiguration, 'isPublicTransitFeatureEnabled'>;

export const DefaultPublicTransitConfiguration: PublicTransitConfiguration = {
    isPublicTransitFeatureEnabled: false,
    type: PublicTransitTypes.TRAIN,
    startTime: Time.midnight(),
    period: TimeSpan.empty(),
    travelTime: undefined,
    gracePeriod: TimeSpan.ofMinutes(5)
}

export default function usePublicTransitConfiguration(): ReadWriteConfiguration<PublicTransitConfiguration> {
    const [publicTransitConfiguration, setPublicTransitConfiguration] = useStateWithLocalStorage<PublicTransitConfiguration>(
        'ttw-n.config.publicTransit',
        DefaultPublicTransitConfiguration,
        PublicTransitConfigurationSerialization
    );

    return convertConfigurationToReadWriteConfiguration(publicTransitConfiguration, setPublicTransitConfiguration);
}

export function useVerifiedPublicTransitConfiguration(): VerifiedPublicTransitConfiguration | undefined {
    const publicTransitConfiguration = useConfiguration(config => config.publicTransit);
    return (
        !publicTransitConfiguration.isPublicTransitFeatureEnabled ||
        publicTransitConfiguration.period.equals(TimeSpan.empty())
            ? undefined
            : publicTransitConfiguration
    );
}

const PublicTransitConfigurationSerialization: Serialization<PublicTransitConfiguration> = createSerialization({
    encode: source => ({
        isPublicTransitFeatureEnabled: source.isPublicTransitFeatureEnabled,
        type: source.type.identifier,
        startTime: source.startTime.toString(),
        period: source.period.toString(),
        travelTime: source.travelTime?.toString(),
        gracePeriod: source.gracePeriod.toString()
    }),
    decode: target => ({
        isPublicTransitFeatureEnabled: target.isPublicTransitFeatureEnabled,
        type: PublicTransitTypes.ofIdentifier(target.type),
        startTime: Time.ofString(target.startTime),
        period: TimeSpan.ofString(target.period),
        travelTime: target.travelTime ? TimeSpan.ofString(target.travelTime) : undefined,
        gracePeriod: TimeSpan.ofString(target.gracePeriod)
    })
});