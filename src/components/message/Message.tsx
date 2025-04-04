import { useContext } from "react";
import { MessageContext } from "@/contexts/MessageContext";

export default function Message() {
    const { message, clear, animationStyles, doAutoClear, setDoAutoClear } = useContext(MessageContext);

    return (
        message &&
        <div className={'absolute top-0 left-1/2 -translate-x-1/2 mt-3'}>
            {
                <div
                    className={`relative bg-neumorphic-50 dark:bg-neumorphic-900 min-w-60 max-w-96 p-4 drop-shadow-xl rounded-2xl overflow-hidden`}
                    style={animationStyles}
                    onClick={() => setDoAutoClear(false)}
                >
                    <div className={'flex flex-row justify-between gap-2'}>
                        <div className={'font-bold whitespace-nowrap overflow-ellipsis overflow-hidden'}>
                            {message.title}
                        </div>

                        <button onClick={clear}>
                            [X]
                        </button>
                    </div>

                    <div>
                        {message.body}
                    </div>

                    <div
                        style={doAutoClear ? { animation: `grow-relative-width ${message.retentionInSeconds}s linear forwards` } : undefined}
                        className={'absolute bottom-0 left-0 h-1 bg-neumorphic-400 dark:bg-neumorphic-500'}
                    />
                </div>
            }
        </div>
    );


}