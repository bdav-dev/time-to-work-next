'use client';

import React, { CSSProperties, useEffect, useState } from "react";


export type Message = {
    title: string | React.ReactNode,
    body: string | React.ReactNode,
    retentionInSeconds?: number
}

type MessageContextType = {
    message: Message | undefined,
    set: (message: Message) => void,
    clear: () => void,
    doAutoClear: boolean,
    setDoAutoClear: (doNotAutoClear: boolean) => void,
    animationStyles: CSSProperties,
}

export const MessageContext = React.createContext<MessageContextType>({ message: undefined, animationStyles: {}, set: () => {}, clear: () => {}, setDoAutoClear: () => {}, doAutoClear: false });

const DEFAULT_RETENTION_IN_SECONDS = 7;
const APPEAR_DISAPPEAR_ANIMATION_DURATION_IN_SECONDS = 0.25;

const APPEAR_STYLES: CSSProperties = { animation: `message-appear ${APPEAR_DISAPPEAR_ANIMATION_DURATION_IN_SECONDS}s ease-out forwards` };
const DISAPPEAR_STYLES: CSSProperties = { animation: `message-disappear ${APPEAR_DISAPPEAR_ANIMATION_DURATION_IN_SECONDS}s ease-in forwards` };

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

type MessageProviderProps = {
    children?: React.ReactNode
}

export default function MessageProvider(props: MessageProviderProps) {
    const [message, setMessage] = useState<Message>();
    const [toAutoClear, setToAutoClear] = useState<Message>();
    const [toMount, setToMount] = useState<Message>();
    const [doAutoClear, setDoAutoClear] = useState<boolean>(true);
    const [animationStyles, setAnimationStyles] = useState<CSSProperties>({});

    useEffect(() => {
        if (doAutoClear && toAutoClear && toAutoClear == message) {
            clear();
        }
    }, [toAutoClear]);

    useEffect(() => {
        if (toMount) {
            setAnimationStyles(APPEAR_STYLES);
            setMessage(toMount);
            setTimeout(
                () => setToAutoClear(toMount),
                (toMount.retentionInSeconds ?? DEFAULT_RETENTION_IN_SECONDS) * 1000
            );
        }
    }, [toMount]);

    async function set(newMessage: Message) {
        if (message) {
            await clear();
        }
        setToMount(newMessage);
    }

    async function clear() {
        setAnimationStyles(DISAPPEAR_STYLES);
        await delay(APPEAR_DISAPPEAR_ANIMATION_DURATION_IN_SECONDS * 1000);
        setMessage(undefined);
        setDoAutoClear(true);
    }

    return (
        <MessageContext.Provider value={{ message, set, clear, doAutoClear, setDoAutoClear, animationStyles }}>
            {props.children}
        </MessageContext.Provider>
    );
}