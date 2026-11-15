import Dialog from "@/components/primitives/Dialog";
import Hyperlink from "@/components/misc/link/Hyperlink";
import { useTheme } from "@/hooks/UseTheme";
import SocialLink from "@/components/misc/link/SocialLink";
import IconSection from "@/components/layout/section/IconSection";
import MaterialSymbol, { MaterialSymbols } from "@/icons/material/MaterialSymbol";
import GitHubInvertocat from "@/icons/logo/GitHubInvertocat";
import DarkAppIcon from "@/icons/appIcon/DarkAppIcon";
import LightAppIcon from "@/icons/appIcon/LightAppIcon";


type AboutDialogProps = {
    isOpen: boolean,
    onRequestClose: () => void,
}

export default function AboutDialog(props: AboutDialogProps) {
    const { theme } = useTheme();

    return (
        <Dialog
            isOpen={props.isOpen}
            onRequestClose={props.onRequestClose}
            title={'Über'}
            overrideSize
            className={"w-fit"}
        >
            <div className={'flex flex-col items-center justify-center gap-7 flex-1'}>

                <div className={'flex flex-col items-center gap-1.5 mt-4'}>
                    {
                        {
                            light: <LightAppIcon className={'size-32 drop-shadow-xl'}/>,
                            dark: <DarkAppIcon className={'size-32 drop-shadow-xl'}/>
                        }[theme]
                    }
                    <div className={'font-bold text-4xl'}>time-to-work</div>
                    <div className={'text-xl'}>Arbeitszeitdashboard</div>
                    Version 0.0.1-SNAPSHOT
                </div>

                <div className={'flex flex-row gap-5 items-end'}>
                    <SocialLink
                        href={'https://www.bdav.dev/code/time-to-work'}
                        icon={<MaterialSymbol symbol={MaterialSymbols.CAPTIVE_PORTAL} className={'text-[1.205em]'}/>}
                        text={"bdav.dev"}
                    />
                    <SocialLink
                        href={'https://github.com/bdav-dev/time-to-work-next'}
                        icon={<GitHubInvertocat className={'text-[1.15em]'}/>}
                        text={"GitHub"}
                    />
                </div>

                <div className={"flex flex-col gap-2.5"}>
                    <IconSection icon={<MaterialSymbol symbol={MaterialSymbols.LOCK}/>}>
                        Daten werden ausschließlich in deinem Browser gespeichert.
                    </IconSection>

                    <IconSection
                        icon={
                            <>
                                <MaterialSymbol symbol={MaterialSymbols.DARK_MODE}/>
                                <MaterialSymbol symbol={MaterialSymbols.SETTINGS}/>
                                <MaterialSymbol symbol={MaterialSymbols.TIMER}/>
                            </>
                        }
                    >
                        Dieses Projekt nutzt <Hyperlink href={'https://fonts.google.com/icons'} openInNewTab>Material Symbole von Google</Hyperlink>.
                    </IconSection>
                </div>
            </div>
        </Dialog>
    );


}