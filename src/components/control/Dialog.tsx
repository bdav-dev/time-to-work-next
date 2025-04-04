import { ReactNode, useEffect, useRef } from "react";
import Button from "@/components/control/Button";


type DialogProps = {
    children?: ReactNode,
    isOpen: boolean,
    onRequestClose: () => void,
    overrideSize?: boolean
}

export default function Dialog(props: DialogProps) {
    const dialog = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        if (props.isOpen) {
            dialog.current?.showModal();
        } else {
            dialog.current?.close();
        }
    }, [props.isOpen]);

    return (
        <dialog
            className={'w-full h-screen p-9 bg-transparent content-center z-40'}
            ref={dialog}
        >
            <div
                className={`
                    ${!props.overrideSize && 'max-w-[90rem] w-full min-h-52'}
                    p-7 rounded-3xl
                    flex flex-col mx-auto
                    bg-neumorphic-100 dark:bg-neumorphic-750 
                    text-neumorphic-700 dark:text-neumorphic-150 
                    stroke-neumorphic-700 dark:stroke-neumorphic-150
                    relative
                `}
            >
                <Button
                    className={'size-12 absolute right-3 top-3 text-xl'}
                    circular
                    onClick={props.onRequestClose}
                >
                    &#10005;
                </Button>
                {props.children}
            </div>
        </dialog>
    );


}