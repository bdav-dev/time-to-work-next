import Hyperlink from "@/components/misc/Hyperlink";

export default function Footer() {

    return (
        <div className={'py-0.5 px-1 flex flex-row gap-2 items-end text-neumorphic-500 dark:text-neumorphic-400'}>
            time-to-work | PREVIEW | Seite in Entwicklung, es kann zu Fehlern kommen

            <Hyperlink className={'ml-auto text-sm font-[350]'} href={"https://www.bdav.dev/datenschutzerklaerung"}>
                Datenschutzerklärung
            </Hyperlink>

            <Hyperlink className={'text-sm font-[350]'} href={"https://www.bdav.dev/impressum"}>
                Impressum
            </Hyperlink>
        </div>
    );
}
