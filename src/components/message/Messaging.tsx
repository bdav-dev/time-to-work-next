import { useContext } from "react";
import { DEFAULT_RETENTION_IN_SECONDS, MessageContext } from "@/contexts/MessageContext";
import Message from "@/components/message/Message";

export default function Messaging() {
    const { message, clear, animationStyles, doAutoClear, setDoAutoClear } = useContext(MessageContext);

    return (
        message &&
        <div className={'absolute top-0 left-1/2 -translate-x-1/2 mt-3 z-50'}>
            {
                <Message
                    message={message}
                    progressBarStyles={
                        doAutoClear
                            ? { animation: `grow-relative-width ${message.retentionInSeconds ?? DEFAULT_RETENTION_IN_SECONDS}s linear forwards` }
                            : undefined
                    }
                    onRequestClose={clear}
                    onClick={() => setDoAutoClear(false)}
                    style={animationStyles}
                />
            }
        </div>
    );
}