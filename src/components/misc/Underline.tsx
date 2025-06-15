type UnderlineProps = {
    string: string,
    delimiter?: string
};

export default function Underline({ string, delimiter = '_' }: UnderlineProps) {
    const [prefix, underlined, suffix] = string.split(delimiter);

    return (
        <span>
            {prefix && <span>{prefix}</span>}
            {underlined && <span className={"underline"}>{underlined}</span>}
            {suffix && <span>{suffix}</span>}
        </span>
    );
}