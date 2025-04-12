import { useContext } from "react";
import { ConfigurationContext, ConfigurationContextType, ReadWriteConfiguration, ReadWriteConfigurationValue } from "@/contexts/ConfigurationContext";


export default function useConfiguration<R extends object>(configExtractor: (config: ConfigurationContextType) => ReadWriteConfiguration<R>): R {
    const config = useContext(ConfigurationContext);

    return (
        Object.entries(configExtractor(config)).reduce(
            (configuration, [key, value]) => ({
                ...configuration, [key]: (value as ReadWriteConfigurationValue<any>).value
            }),
            {}
        ) as R
    );
}
