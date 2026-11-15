import { Fragment } from "react";
import { splitWithoutRemoving } from "@/util/StringUtils";
import { createIsLast } from "@/util/ArrayUtils";


type InjectWordBreaksProps = {
    text: string,
    augment?: string[],
    at?: string[]
}

export default function InjectWordBreaks(props: InjectWordBreaksProps) {
    const chunks = splitWithoutRemoving(
        props.text,
        props.at ?? ['/', '-', '&', '?', '#', '=', ...props.augment ?? []]
    );
    const isLast = createIsLast(chunks);

    return (
        <span>
            {
                chunks.map((chunk, index) => <Fragment key={index}>{chunk}{!isLast(index) && <wbr/>}</Fragment>)
            }
        </span>
    );
}
