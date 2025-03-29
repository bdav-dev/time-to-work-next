import { extractValue } from "@/util/ObjectUtils";

export type NeumorphicBlueprint = {
    margin?: number,
    active?: boolean,
    inverted?: boolean
    shadow: {
        distance: number | { x: number, y: number } | { left: number, top: number, right: number, bottom: number },
        blur: number
    }
}

export type FlattenedNeumorphicBlueprint = {
    margin?: number,
    active?: boolean,
    inverted?: boolean
    left: number,
    top: number,
    right: number,
    bottom: number,
    blur: number
}

export class NeumorphicBlueprintFactory {
    private constructor() {}

    static createSmall(): NeumorphicBlueprint {
        return {
            margin: 3,
            shadow: {
                distance: 2,
                blur: 4
            }
        };
    }

    static createMedium(): NeumorphicBlueprint {
        return {
            margin: 10,
            shadow: {
                distance: 5,
                blur: 10
            }
        };
    }

    static createLarge(): NeumorphicBlueprint {
        return {
            margin: 17,
            shadow: {
                distance: 13,
                blur: 20
            }
        };
    }
}


export default function flattenNeumorphicBlueprint(blueprint: NeumorphicBlueprint): FlattenedNeumorphicBlueprint {
    const distance = blueprint.shadow.distance;
    const distances = {
        left: (extractValue(distance, 'left', 'x') ?? distance) as number,
        right: (extractValue(distance, 'right', 'x') ?? distance) as number,
        top: (extractValue(distance, 'top', 'y') ?? distance) as number,
        bottom: (extractValue(distance, 'bottom', 'y') ?? distance) as number
    };

    return {
        ...blueprint,
        ...distances,
        blur: blueprint.shadow.blur,
    }
}


