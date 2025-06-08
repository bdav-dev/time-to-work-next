export type TimelineBlockColor = {
    background: string,
    labelBackground: string
}


export class TimelineMarkerColors {
    static readonly RED = "#ff4d4d";
    static readonly GREEN = "#3eb36b";

    private constructor() {}
}

export class TimelineBlockColors {
    static readonly BLUE: TimelineBlockColor = {
        background: '#5887FF',
        labelBackground: '#3F61B8'
    };
    static readonly GREEN: TimelineBlockColor = {
        background: '#44c576',
        labelBackground: '#38a35f'
    };
    static readonly ROSE: TimelineBlockColor = {
        background: '#e04d6a',
        labelBackground: '#b33d57'
    };
    static readonly RED: TimelineBlockColor = {
        background: '#ef5252',
        labelBackground: '#ca4545'
    };
    static readonly CYAN: TimelineBlockColor = {
        background: '#49c0d4',
        labelBackground: '#0891b2'
    };
    static readonly YELLOW: TimelineBlockColor = {
        background: '#d4c848',
        labelBackground: '#b8a30b'
    };

    private constructor() {}
}
