import { ReactNode } from "react";
import Icon, { IconProps } from "@/icons/Icon";


export type WeightableIconProps = IconProps & { weight?: number };

export default function WeightableIcon(props: WeightableIconProps & { children?: ReactNode, weightRatio: WeightRatio }) {
    return (
        <Icon className={props.className} style={{ strokeWidth: convertWeightToStrokeWidth(props.weight, props.weightRatio), ...props.style }}>
            {props.children}
        </Icon>
    );
}

export type WeightRatio = {
    strokeWidth: number,
    atWeight: number
}

function convertWeightToStrokeWidth(weight: number | undefined, weightRatio: WeightRatio) {
    return (weight ?? 400) * (weightRatio.strokeWidth / weightRatio.atWeight);
}
