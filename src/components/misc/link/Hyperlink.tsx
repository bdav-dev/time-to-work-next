import Link from "next/link";
import { ReactNode } from "react";
import InjectWordBreaks from "@/components/misc/InjectWordBreaks";


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
            className={`${props.className} hover:underline`}
            target={props.openInNewTab ? "_blank" : "_self"}
            rel={"noopener noreferrer"}
        >
            {props.children ?? <InjectWordBreaks text={props.href}/>}
        </Link>
    );
}
