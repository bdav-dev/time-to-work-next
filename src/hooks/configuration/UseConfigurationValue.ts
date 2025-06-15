import { useContext } from "react";
import { ReadWriteConfigurationValue } from "@/configuration/Configuration";
import { ConfigurationContext, ConfigurationContextType } from "@/contexts/ConfigurationContext";


export default function useConfigurationValue<V>(configValueExtractor: (config: ConfigurationContextType) => ReadWriteConfigurationValue<V>): V {
    const config = useContext(ConfigurationContext)

    return configValueExtractor(config).value;
}
