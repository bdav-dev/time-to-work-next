import { ReactNode } from "react";

export type Status = 'green' | 'yellow' | 'red';

type StatusIndicatorProps = {
    status: Status,
    text?: { [key in Status]?: ReactNode }
};

export default function StatusIndicator({ status, text }: StatusIndicatorProps) {
    return (
        <div className={'w-fit flex gap-2 items-center font-bold'}>
            <div className={`min-w-5 min-h-5 size-5 rounded-full ${MessageTypeClassNames[status]}`}/>
            {text && text[status]}
        </div>
    );
}

const MessageTypeClassNames: { [key in Status]: string } = {
    green: 'bg-green-500 dark:bg-green-400',
    yellow: 'bg-yellow-500 dark:bg-yellow-400',
    red: 'bg-red-500'
};