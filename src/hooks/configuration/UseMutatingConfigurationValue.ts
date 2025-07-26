import { useContext } from "react";
import { FlatReadWriteConfigurationValue, ReadWriteConfigurationValue } from "@/configuration/Configuration";
import { ConfigurationContext, ConfigurationContextType } from "@/contexts/ConfigurationContext";

export default function useMutatingConfigurationValue<V>(
    configValueExtractor: (config: ConfigurationContextType) => ReadWriteConfigurationValue<V>
): FlatReadWriteConfigurationValue<V> {
    const config = useContext(ConfigurationContext)
    const readWriteConfigValue = configValueExtractor(config);

    return [readWriteConfigValue.value, readWriteConfigValue.set];
}
