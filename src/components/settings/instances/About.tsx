import Elevation from "@/components/layout/Elevation";
import Section from "@/components/layout/Section";
import Hyperlink from "@/components/misc/Hyperlink";


export default function About() {

    return (
        <div className={'flex flex-col items-center justify-center gap-6 flex-1'}>
            <div className={'flex flex-col items-center gap-1'}>
                <Elevation className={'text-5xl'}>
                    ttw
                </Elevation>
                <div className={'font-bold text-4xl'}>time-to-work</div>
                <div className={'text-xl'}>Arbeitszeitdashboard</div>
            </div>

            <div>
                David Berezowski
            </div>

            <div className={'flex flex-col items-center gap-1'}>
                <div>Visit this project</div>

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

            <Section className={'w-full'}>
                // TODO: Explain that data is only stored in the browser
            </Section>

        </div>
    );
}
