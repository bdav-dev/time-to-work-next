import { ConfigurationContext, ConfigurationContextType, ReadWriteConfigurationValue } from "@/contexts/ConfigurationContext";
import { useContext } from "react";


export default function useConfigurationValue<V>(configValueExtractor: (config: ConfigurationContextType) => ReadWriteConfigurationValue<V>): V {
    const config = useContext(ConfigurationContext)

    return configValueExtractor(config).value;
}
