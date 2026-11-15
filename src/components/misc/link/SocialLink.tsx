import { ReactNode } from "react";
import Link from "next/link";


type SocialLinkProps = {
    href: string,
    icon: ReactNode,
    text: string
}

export default function SocialLink(props: SocialLinkProps) {
    return (
        <Link
            href={props.href}
            className={'inline-flex flex-col items-center gap-0.5 group'}
            target={"_blank"}
            rel={"noopener noreferrer"}
        >
            {props.icon}
            <span className={"text-xs group-hover:underline"}>
                {props.text}
            </span>
        </Link>
    );
}
