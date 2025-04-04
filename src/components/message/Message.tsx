import { Message as Msg, MessageType } from "@/contexts/MessageContext";
import { CSSProperties } from "react";

type MessageProps = {
    message: Msg,
    progressBarStyles?: CSSProperties,
    onClick?: () => void,
    onRequestClose?: () => void,
    style?: CSSProperties
}

const MessageTypeClassNames: { [key in MessageType]: string } = {
    error: 'bg-red-500',
    success: 'bg-green-500 dark:bg-green-400',
    warning: 'bg-yellow-500 dark:bg-yellow-400'
};

export default function Message(props: MessageProps) {
    return (
        <div
            className={`
                relative min-w-60 max-w-96
                p-3.5
                bg-neumorphic-50 dark:bg-neumorphic-850
                drop-shadow-xl rounded-2xl overflow-hidden
            `}
            style={props.style}
            onClick={props.onClick}
        >
            <div className={'flex flex-row items-center gap-2'}>
                {
                    props.message.type &&
                    <div className={`min-w-5 min-h-5 size-5 rounded-full ${MessageTypeClassNames[props.message.type]}`}/>
                }

                <div className={'font-bold overflow-ellipsis whitespace-nowrap overflow-hidden'}>
                    {props.message.title}
                </div>

                <button onClick={props.onRequestClose} className={'ml-auto'}>
                    [X]
                </button>
            </div>

            <div>
                {props.message.body}
            </div>

            <div
                style={props.progressBarStyles}
                className={'absolute bottom-0 left-0 h-1 bg-neumorphic-400 dark:bg-neumorphic-500'}
            />
        </div>
    );
}
