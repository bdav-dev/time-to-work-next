import { ReactNode, useEffect, useRef } from "react";
import Button from "@/components/primitives/control/Button";
import MaterialSymbol from "@/components/icon/MaterialSymbol";
import { MaterialSymbols } from "@/icon/MaterialSymbols";


type DialogProps = {
    title?: ReactNode,
    isOpen: boolean,
    onRequestClose: () => void,
    overrideSize?: boolean,
    children?: ReactNode,
    className?: string,
    showCloseButton?: boolean,
    closableWithEscKey?: boolean
}

export default function Dialog({ closableWithEscKey = true, ...props }: DialogProps) {
    const dialog = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        if (props.isOpen) {
            dialog.current?.showModal();
        } else {
            dialog.current?.close();
        }
    }, [props.isOpen]);

    useEffect(() => {
        const handleCancel = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && !closableWithEscKey) {
                event?.preventDefault();
            }
        };
        dialog.current?.addEventListener('keydown', handleCancel);

        return () => dialog.current?.removeEventListener('keydown', handleCancel);
    }, []);

    // TODO: Make it so that dialog adapts to screen size, content inside gets scroll bar
    return (
        <dialog
            onClose={props.onRequestClose}
            className={'w-full h-screen p-9 bg-transparent content-center z-40'}
            ref={dialog}
            onCancel={closableWithEscKey ? undefined : event => event.preventDefault()}
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
                    ${props.className}
                `}
            >
                <div className={'flex justify-start'}>
                    {
                        props.title &&
                        <h1 className={'text-2xl font-bold px-7 pt-7'}>
                            {props.title}
                        </h1>
                    }
                    {
                        (props.showCloseButton ?? true) &&
                        <div className={'px-3 pt-3 ml-auto'}>
                            <Button
                                className={'size-12 text-xl'}
                                circular
                                onClick={props.onRequestClose}
                            >
                                <MaterialSymbol
                                    symbol={MaterialSymbols.CLOSE}
                                    className={'size-7 fill-neumorphic-600 dark:fill-neumorphic-300'}
                                />
                            </Button>
                        </div>
                    }
                </div>

                <div className={'flex flex-col px-7 pb-7 flex-1'}>
                    {props.children}
                </div>
            </div>
        </dialog>
    );
}
