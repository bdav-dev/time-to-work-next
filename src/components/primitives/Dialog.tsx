import { ReactNode, useEffect, useRef } from "react";
import Button from "@/components/primitives/control/Button";


type DialogProps = {
    children?: ReactNode,
    isOpen: boolean,
    onRequestClose: () => void,
    overrideSize?: boolean,
    title?: string | ReactNode
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
            onClose={props.onRequestClose}
            className={'w-full h-screen p-9 bg-transparent content-center z-40'}
            ref={dialog}
        >
            <div
                className={`
                    ${!props.overrideSize && 'max-w-[90rem] w-full min-h-52'}
                    rounded-3xl
                    flex flex-col mx-auto
                    bg-neumorphic-100 dark:bg-neumorphic-750 
                    text-neumorphic-700 dark:text-neumorphic-150 
                    stroke-neumorphic-700 dark:stroke-neumorphic-150
                    relative
                `}
            >
                <div className={'flex justify-start'}>
                    {
                        props.title &&
                        <h1 className={'text-2xl font-bold px-7 pt-7'}>
                            {props.title}
                        </h1>
                    }
                    <div className={'px-3 pt-3 ml-auto'}>
                        <Button
                            className={'size-12 text-xl'}
                            circular
                            onClick={props.onRequestClose}
                        >
                            &#10005;
                        </Button>
                    </div>
                </div>

                <div className={'flex flex-col px-7 pb-7'}>
                    {props.children}
                </div>
            </div>
        </dialog>
    );


}