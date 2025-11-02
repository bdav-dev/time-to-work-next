import { ReactNode } from "react";

export type Status = 'green' | 'yellow' | 'red' | 'gray';

type StatusIndicatorProps = {
    status: Status,
    text?: string | { [key in Status]?: ReactNode }
};

export default function StatusIndicator({ status, text }: StatusIndicatorProps) {
    return (
        <div className={'w-fit flex gap-2 items-center font-bold'}>
            <div className={`min-w-[1.375rem] min-h-3 size-3 rounded-full ${MessageTypeClassNames[status]}`}/>
            {text && (typeof text === "string" ? text : text[status])}
        </div>
    );
}

const MessageTypeClassNames: { [key in Status]: string } = {
    green: 'bg-green-500 dark:bg-green-400',
    yellow: 'bg-yellow-500 dark:bg-yellow-400',
    red: 'bg-red-500',
    gray: 'bg-neutral-400 dark:bg-neutral-600'
};