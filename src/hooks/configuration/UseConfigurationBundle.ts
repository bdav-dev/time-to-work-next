import { useContext } from "react";
import { ReadWriteConfiguration, ReadWriteConfigurationValue } from "@/configuration/Configuration";
import { ConfigurationContext, ConfigurationContextType } from "@/contexts/ConfigurationContext";


export default function useConfigurationBundle<V>(configValueExtractor: (config: ConfigurationContextType) => ReadWriteConfiguration<V>): V {
    const config = useContext(ConfigurationContext)

    return toConfiguration(configValueExtractor(config));
}

function toConfiguration<V>(readWriteConfig: ReadWriteConfiguration<V>): V {
    return Object.entries(readWriteConfig)
        .reduce((config, [key, value]) => (
            {
                ...config,
                [key]: key.startsWith("_")
                    ? toConfiguration(value as ReadWriteConfiguration<any>)
                    : (value as ReadWriteConfigurationValue<any>).value,
            }
        ), {}) as V;
}
