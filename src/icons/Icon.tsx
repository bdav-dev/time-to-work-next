import { CSSProperties, ReactNode } from "react";


export type IconProps = {
    className?: string,
    style?: CSSProperties
};

export default function Icon(props: IconProps & { children?: ReactNode }) {
    return (
        <span className={'icon'}>
            <span className={props.className} style={props.style}>
                {props.children}
            </span>
        </span>
    );
}
