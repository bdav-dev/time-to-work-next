import { TimelineTheme } from "@/components/timeline/module/TimelineTypes";


export default class DefaultTimelineThemes {
    public static readonly LIGHT: TimelineTheme = {
        backgroundColor: "#ecf0f3",
        marginColor: "#d1d4d7",
        textColor: "#3b3d43",
        timeStepColor: "#b3b6b8",
        subTimeStepColor: "#dbdee1",
        defaultBlockBackgroundColor: "#5887FF",
        defaultMarkerColor: "#ef5252",
    };
    public static readonly DARK: TimelineTheme = {
        backgroundColor: "#303135",
        marginColor: "#27282b",
        textColor: "#e0e4e8",
        timeStepColor: "#494b51",
        subTimeStepColor: "#393a3f",
        defaultBlockBackgroundColor: "#5887FF",
        defaultMarkerColor: "#ef5252",
    };

    private constructor() {}
}
