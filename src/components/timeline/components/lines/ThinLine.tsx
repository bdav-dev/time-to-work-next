type ThinLineProps = {
    position: number,
    color: string
}

export default function ThinLine(props: ThinLineProps) {

    return (
        <div
            className={`
                absolute w-[1px] h-full -translate-x-1/2
                rounded-full
                select-none
            `}
            style={{
                left: `${props.position}%`,
                backgroundColor: props.color
            }}
        />
    );

}