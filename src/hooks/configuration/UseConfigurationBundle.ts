import { useContext } from "react";
import { ReadWriteConfiguration, ReadWriteConfigurationValue } from "@/configuration/Configuration";
import { ConfigurationContext, ConfigurationContextType } from "@/contexts/ConfigurationContext";


export default function useConfigurationBundle<V>(configValueExtractor: (config: ConfigurationContextType) => ReadWriteConfiguration<V>): V {
    const config = useContext(ConfigurationContext)

    function toConfiguration<V>(readWriteConfig: ReadWriteConfiguration<V>): V {
        return Object.entries(readWriteConfig)
            .reduce((config, [key, value]) => {
                return {
                    ...config,
                    [key]: key.startsWith("_")
                        ? toConfiguration(value as ReadWriteConfiguration<any>)
                        : (value as ReadWriteConfigurationValue<any>).value,
                }
            }) as V;
    }

    return toConfiguration(configValueExtractor(config));
}
