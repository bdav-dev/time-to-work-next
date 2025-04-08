export type Status = 'green' | 'yellow' | 'red';

type StatusIndicatorProps = {
    status: Status
};

export default function StatusIndicator({ status }: StatusIndicatorProps) {
    return <div className={`min-w-5 min-h-5 size-5 rounded-full ${MessageTypeClassNames[status]}`}/>;
}

const MessageTypeClassNames: { [key in Status]: string } = {
    green: 'bg-green-500 dark:bg-green-400',
    yellow: 'bg-yellow-500 dark:bg-yellow-400',
    red: 'bg-red-500'
};