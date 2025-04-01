type NowLineProps = {
    position: number,
    color: string,
}

export default function NowLine(props: NowLineProps) {

    return (
        <div
            className={`
                absolute -translate-x-1/2
                rounded-full
                h-full
            `}
            style={{
                scale: '1.07',
                backgroundColor: props.color,
                width: '2px',
                left: `${props.position}%`
            }}
        >
            <span
                className={`
                    absolute -translate-x-1/2
                    top-[-1.55em] select-none
                `}
                style={{ color: props.color }}
            >
                Jetzt
            </span>
        </div>
    );

}