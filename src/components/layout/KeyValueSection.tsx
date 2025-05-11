import Section from "@/components/layout/Section";
import { ReactNode } from "react";

type KeyValueSectionProps = {
    first: string | ReactNode,
    second: string | ReactNode
}

export default function KeyValueSection(props: KeyValueSectionProps) {
    return (
        <Section className={'flex justify-between gap-2.5'}>
            <div className={'font-bold'}>{props.first}</div>
            <div>{props.second}</div>
        </Section>
    );
}
