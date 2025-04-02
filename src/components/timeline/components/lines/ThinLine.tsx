type ThinLineProps = {
    position: number
}

export default function ThinLine(props: ThinLineProps) {
    return (
        <div
            className={`
                absolute w-[1px] h-full -translate-x-1/2
                bg-[#dbdee1] dark:bg-[#393a3f]
                rounded-full
                select-none
            `}
            style={{
                left: `${props.position}%`
            }}
        />
    );
}