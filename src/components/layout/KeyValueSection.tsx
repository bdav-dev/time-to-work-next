import Section from "@/components/layout/Section";
import React from "react";

type KeyValueSectionProps = {
    first: string | React.ReactNode,
    second: string | React.ReactNode
}

export default function KeyValueSection(props: KeyValueSectionProps) {
    return (
        <Section className={'flex justify-between gap-2.5'}>
            <div className={'font-bold'}>{props.first}</div>
            <div>{props.second}</div>
        </Section>
    );
}