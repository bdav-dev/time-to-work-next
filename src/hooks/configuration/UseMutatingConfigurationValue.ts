import { useContext } from "react";
import { ConfigurationContext, ConfigurationContextType, FlatReadWriteConfigurationValue, ReadWriteConfigurationValue } from "@/contexts/ConfigurationContext";

export default function useMutatingConfigurationValue<V>(
    configValueExtractor: (config: ConfigurationContextType) => ReadWriteConfigurationValue<V>
): FlatReadWriteConfigurationValue<V> {
    const config = useContext(ConfigurationContext)
    const readWriteConfigValue = configValueExtractor(config);

    return [readWriteConfigValue.value, readWriteConfigValue.set];
}