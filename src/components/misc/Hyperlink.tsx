import Link from "next/link";
import { ReactNode } from "react";
import { splitWithoutRemoving } from "@/util/StringUtils";
import { createIsLast } from "@/util/ArrayUtils";


type HyperlinkProps = {
    href: string,
    className?: string,
    openInNewTab?: boolean,
    children?: ReactNode
};

export default function Hyperlink(props: HyperlinkProps) {
    return (
        <Link
            href={props.href}
            className={`${props.className} underline`}
            target={props.openInNewTab ? "_blank" : "_self"}
            rel="noopener noreferrer"
        >
            {props.children ?? <InjectWordBreaks text={props.href}/>}
        </Link>
    );
}

function InjectWordBreaks(props: { text: string, augment?: string[], at?: string[] }) {
    const chunks = splitWithoutRemoving(
        props.text,
        props.at ?? ['/', '-', '&', '?', '#', '=', ...props.augment ?? []]
    );
    const isLast = createIsLast(chunks);

    return (
        <span>
            {chunks.map((chunk, i) => <span key={i}>{chunk}{!isLast(i) && <wbr/>}</span>)}
        </span>
    );
}