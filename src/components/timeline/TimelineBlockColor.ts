import { ThemedColorPair } from "@/color/Color";

export type TimelineBlockColor = {
    block: ThemedColorPair,
    timeLabel: ThemedColorPair
}

export class TimelineBlockColors {
    static readonly BLUE: TimelineBlockColor = {
        block: { background: '#5887FF' }, // saturation 65,5
        timeLabel: { background: '#3F61B8' } // saturation 65,8
    };
    static readonly GREEN: TimelineBlockColor = {
        block: { background: '#44c576' },
        timeLabel: { background: '#38a35f' }
    };
    static readonly ROSE: TimelineBlockColor = {
        block: { background: '#e04d6a' },
        timeLabel: { background: '#b33d57' }
    };
    static readonly RED: TimelineBlockColor = {
        block: { background: '#ef5252' },
        timeLabel: { background: '#ca4545' }
    };
    static readonly CYAN: TimelineBlockColor = {
        block: { background: '#49c0d4' },
        timeLabel: { background: '#0891b2' }
    };
    static readonly YELLOW: TimelineBlockColor = {
        block: { background: '#d4c848' },
        timeLabel: { background: '#b8a30b' }
    };
}
