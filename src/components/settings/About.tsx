import Elevation from "@/components/layout/Elevation";
import Link from "next/link";
import Section from "@/components/layout/Section";


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
                    <Link
                        href={'https://www.bdav.dev/code/time-to-work-next'}
                        className={'underline'}
                    >
                        Website
                    </Link>
                    <Link
                        href={'https://github.com/bdav-dev/time-to-work-next'}
                        className={'underline'}
                    >
                        GitHub
                    </Link>
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
