import { ReactNode } from "react";


type ArrowProps = {
    children?: ReactNode,
    className?: string
};

export default function Arrow(props: ArrowProps) {
    return (
        <div className={`text-center leading-none ${props.className}`}>
            {
                props.children
            }
            <div className={'text-2xl leading-none'}>
                {'->'}
            </div>
        </div>
    );
}
