import { ThemedColorPair } from "@/color/color";

export type TimelineBlockColor = {
    block: ThemedColorPair,
    timeLabel: ThemedColorPair
}

export enum DefaultTimelineBlockColor {
    BLUE,
    GREEN,
    ROSE,
    RED,
    CYAN,
    YELLOW
}

const DefaultTimelineBlockColorMap: { [key in DefaultTimelineBlockColor]: TimelineBlockColor } = {
    [DefaultTimelineBlockColor.BLUE]: {
        block: { background: '#5887FF' }, // saturation 65,5
        timeLabel: { background: '#3F61B8' } // saturation 65,8
    },
    [DefaultTimelineBlockColor.GREEN]: {
        block: { background: '#44c576' },
        timeLabel: { background: '#38a35f' }
    },
    [DefaultTimelineBlockColor.ROSE]: {
        block: { background: '#e04d6a' },
        timeLabel: { background: '#b33d57' }
    },
    [DefaultTimelineBlockColor.RED]: {
        block: { background: '#ef5252' },
        timeLabel: { background: '#ca4545' }
    },
    [DefaultTimelineBlockColor.CYAN]: {
        block: { background: '#49c0d4' },
        timeLabel: { background: '#0891b2' }
    },
    [DefaultTimelineBlockColor.YELLOW]: {
        block: { background: '#d4c848' },
        timeLabel: { background: '#b8a30b' }
    }
}

export function realizeTimelineBlockColor(color: TimelineBlockColor | DefaultTimelineBlockColor) {
    return (
        typeof color === 'object'
            ? color
            : DefaultTimelineBlockColorMap[color]
    );
}

