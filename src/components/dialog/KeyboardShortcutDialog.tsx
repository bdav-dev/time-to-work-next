import Dialog from "@/components/primitives/Dialog";
import Section from "@/components/layout/Section";
import KeyboardShortcut, { ShortcutSteps } from "@/components/shortcuts/KeyboardShortcut";
import Setting from "@/components/settings/Setting";
import Underline from "@/components/misc/Underline";
import { ReactNode } from "react";


type KeyboardShortcutDialogProps = {
    isOpen: boolean,
    onRequestClose: () => void
};

export default function KeyboardShortcutDialog(props: KeyboardShortcutDialogProps) {

    return (
        <Dialog
            isOpen={props.isOpen}
            onRequestClose={props.onRequestClose}
            title={'Tastenkürzel'}
            overrideSize
            className={'max-w-[65rem]'}
        >
            <div className={"flex flex-col lg:flex-row gap-2"}>
                {
                    shortcutSections.map((section, sectionIndex) => (
                        <Section className={"flex flex-col gap-2.5 flex-1"} key={sectionIndex}>
                            <div className={"font-bold text-lg"}>{section.title}</div>
                            {
                                section.shortcuts.map((shortcut, shortcutIndex) => (
                                    <Setting
                                        label={shortcut.label}
                                        setting={<KeyboardShortcut steps={shortcut.shortcut}/>}
                                        key={shortcutIndex}
                                        noPadding
                                    />
                                ))
                            }
                        </Section>
                    ))
                }
            </div>
        </Dialog>
    );
}

const shortcutSections: { title: string, shortcuts: { label: ReactNode, shortcut: ShortcutSteps }[] }[] = [
    {
        title: 'Zeiteingabe',
        shortcuts: [
            {
                label: "Eingabe",
                shortcut: ["ENTER"]
            },
            {
                label: <Underline string={'_S_tandardwert laden'}/>,
                shortcut: ["S"]
            },
            {
                label: <Underline string={'Aktuelle Zeit ("_J_etzt") laden'}/>,
                shortcut: ["J"]
            },
            {
                label: <Underline string={'Endzeit des _a_ngrenzenden Blocks laden'}/>,
                shortcut: ["A"]
            }
        ]
    },
    {
        title: "Zeitstempel schließen",
        shortcuts: [
            {
                label: <Underline string={'Doppelt Stempeln'}/>,
                shortcut: ["SHIFT", { literal: "linke Maustaste" }]
            }
        ]
    }
];
