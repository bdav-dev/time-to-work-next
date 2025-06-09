import Dialog from "@/components/primitives/Dialog";
import Elevation from "@/components/layout/Elevation";
import Hyperlink from "@/components/misc/Hyperlink";
import Section from "@/components/layout/Section";
import MaterialSymbol from "@/components/icon/MaterialSymbol";
import { MaterialSymbols } from "@/icon/MaterialSymbols";
import VerticalRuler from "@/components/layout/VerticalRuler";

type AboutDialogProps = {
    isOpen: boolean,
    onRequestClose: () => void,
}

export default function AboutDialog(props: AboutDialogProps) {
    return (
        <Dialog
            isOpen={props.isOpen}
            onRequestClose={props.onRequestClose}
            title={'Über'}
            overrideSize
            className={'max-w-[50rem] min-h-[35rem]'}
        >
            <div className={'flex flex-col items-center justify-center gap-6 flex-1'}>
                <div className={'flex flex-col items-center gap-1'}>
                    <Elevation className={'text-5xl'}>
                        ttw
                    </Elevation>
                    <div className={'font-bold text-4xl'}>time-to-work</div>
                    <div className={'text-xl'}>Arbeitszeitdashboard</div>
                </div>

                <div className={'flex flex-col items-center gap-1'}>
                    <div>Besuche dieses Projekt</div>

                    <div className={'flex flex-row gap-6'}>
                        <Hyperlink href={'https://www.bdav.dev/code/time-to-work-next'} openInNewTab>
                            Website
                        </Hyperlink>
                        <Hyperlink href={'https://github.com/bdav-dev/time-to-work-next'} openInNewTab>
                            GitHub
                        </Hyperlink>
                    </div>
                </div>

                <div>
                    Version 0.0.1-SNAPSHOT
                </div>

                {
                    // TODO: Explain that data is only stored in the browser
                }
                <Section className={'flex items-center gap-3'}>
                    <div className={'flex gap-1'}>
                        <MaterialSymbol symbol={MaterialSymbols.DARK_MODE}/>
                        <MaterialSymbol symbol={MaterialSymbols.SETTINGS}/>
                        <MaterialSymbol symbol={MaterialSymbols.TIMER}/>
                    </div>
                    <VerticalRuler className={'h-7'}/>
                    Dieses Projekt nutzt <Hyperlink href={'https://fonts.google.com/icons'} openInNewTab>Google Material Symbole</Hyperlink>
                </Section>
            </div>
        </Dialog>
    );


}