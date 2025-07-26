import { HTMLAttributes, ReactNode } from "react";
import Section from "@/components/layout/section/Section";
import VerticalRuler from "@/components/layout/VerticalRuler";

type IconSectionProps = {
    icon: ReactNode
} & HTMLAttributes<HTMLDivElement>

export default function IconSection({ icon, children, className, ...rest }: IconSectionProps) {
    return (
        <Section className={`flex items-center gap-3 ${className}`} {...rest}>
            <div className={"flex gap-1"}>
                {icon}
            </div>
            <VerticalRuler className={'self-stretch'}/>
            <div>
                {children}
            </div>
        </Section>
    );
}