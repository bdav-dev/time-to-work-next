type ThickLineProps = {
    position: number
}

export default function ThickLine(props: ThickLineProps) {
    return (
        <div
            className={`
                absolute w-[2px] h-full -translate-x-1/2
                bg-[#b3b6b8] dark:bg-[#494b51]
                rounded-full
                select-none
            `}
            style={{
                left: `${props.position}%`
            }}
        />
    );
}