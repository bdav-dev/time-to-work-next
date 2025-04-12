import Time from "@/time/Time";
import { ReadWriteConfigurationValue } from "@/contexts/ConfigurationContext";


export default class EmptyConfigurationReadWriteValue {
    static readonly TIME: ReadWriteConfigurationValue<Time> = {
        set: () => {},
        value: Time.of(0, 0)
    };
    static readonly NUMBER: ReadWriteConfigurationValue<number> = {
        set: () => {},
        value: 0
    };
    static readonly BOOLEAN: ReadWriteConfigurationValue<boolean> = {
        set: () => {},
        value: false
    };
}
