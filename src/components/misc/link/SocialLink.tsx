import Hyperlink from "@/components/misc/link/Hyperlink";
import { ReactNode, SVGProps } from "react";


type SocialLinkProps = {
    href: string,
    icon: (props: SVGProps<SVGSVGElement>) => ReactNode,
    text: string
}

export default function SocialLink(props: SocialLinkProps) {

    return (
        <Hyperlink
            href={props.href}
            openInNewTab
            className={"inline-flex flex-col items-center gap-0.5"}
        >
            {props.icon({ className: "size-7" })}
            <span className={"text-xs"}>
                {props.text}
            </span>
        </Hyperlink>
    );
}