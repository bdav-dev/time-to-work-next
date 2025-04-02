type NowLineProps = {
    position: number
}

export default function NowLine(props: NowLineProps) {
    return (
        <div
            className={`
                absolute -translate-x-1/2
                bg-[#FF3F3F] dark:bg-[#ff4d4d]
                rounded-full
                h-full
            `}
            style={{
                scale: '1.07',
                width: '2px',
                left: `${props.position}%`
            }}
        >
            <span
                className={`
                    absolute -translate-x-1/2
                    text-[#FF3F3F] dark:text-[#ff4d4d]
                    top-[-1.55em] select-none
                `}
            >
                Jetzt
            </span>
        </div>
    );
}
