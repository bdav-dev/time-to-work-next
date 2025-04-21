import Time from "@/time/Time";
import TimeSpan from "@/time/TimeSpan";
import { ReadWriteConfigurationValue } from "@/configuration/Configuration";


export default class EmptyConfigurationReadWriteValue {
    static readonly TIME: ReadWriteConfigurationValue<Time> = {
        set: () => {},
        value: Time.midnight()
    };
    static readonly TIME_SPAN: ReadWriteConfigurationValue<TimeSpan> = {
        set: () => {},
        value: TimeSpan.empty()
    };
    static readonly NUMBER: ReadWriteConfigurationValue<number> = {
        set: () => {},
        value: 0
    };
    static readonly BOOLEAN: ReadWriteConfigurationValue<boolean> = {
        set: () => {},
        value: false
    };
    static readonly UNDEFINED: ReadWriteConfigurationValue<undefined> = {
        set: () => {},
        value: undefined
    };
}
