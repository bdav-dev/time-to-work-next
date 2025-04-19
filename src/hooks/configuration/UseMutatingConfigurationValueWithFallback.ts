import { useContext } from "react";
import { ConfigurationContextType, FlatReadWriteConfigurationValueWithFallback, ReadWriteConfigurationValue } from "@/configuration/Configuration";
import { ConfigurationContext } from "@/contexts/ConfigurationContext";


export default function useMutatingConfigurationValueWithFallback<V>(
    configValueExtractor: (config: ConfigurationContextType) => ReadWriteConfigurationValue<V>,
    fallback: V
): FlatReadWriteConfigurationValueWithFallback<V> {
    const config = useContext(ConfigurationContext)
    const readWriteConfigValue = configValueExtractor(config);

    const set = (value?: V) => readWriteConfigValue.set(value ?? fallback);

    return [readWriteConfigValue.value, set];
}
