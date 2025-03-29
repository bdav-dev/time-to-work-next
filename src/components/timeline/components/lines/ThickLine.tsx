type ThickLineProps = {
    position: number,
    color: string
}

export default function ThickLine(props: ThickLineProps) {
    return (
        <div
            className={`
                absolute w-[2px] h-full -translate-x-1/2
                rounded-full
                select-none
            `}
            style={{
                left: `${props.position}%`,
                backgroundColor: props.color,
            }}
        />
    );
}