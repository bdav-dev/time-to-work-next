import Key from "./Key";


export type ShortcutSteps = (string | { literal: string })[];

type KeyboardShortcutProps = {
    steps: ShortcutSteps,
    className?: string
}

export default function KeyboardShortcut(props: KeyboardShortcutProps) {

    return (
        <div className={`flex items-center w-fit gap-2 ${props.className}`}>
            {
                props.steps.map((step, i) => (
                    <div key={i} className={"flex items-center w-fit gap-2"}>
                        {i != 0 && <div>+</div>}
                        {typeof step === 'string' ? <Key>{step}</Key> : <div>{step.literal}</div>}
                    </div>
                ))
            }
        </div>
    );
}
