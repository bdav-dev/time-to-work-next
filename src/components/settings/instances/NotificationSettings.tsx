'use client';

import StatusIndicator from "@/components/misc/StatusIndicator";
import Settings from "@/components/settings/Settings";
import Section from "@/components/layout/section/Section";
import FlatButton from "@/components/primitives/control/FlatButton";
import useBrowserNotifications from "@/hooks/UseBrowserNotifications";


export default function NotificationSettings() {
    const browserNotifications = useBrowserNotifications();

    return (
        <div>
            <Settings
                className={'mt-2'}
                sections={[
                    {
                        hideHorizontalRuler: true,
                        settings: <>
                            <Section className={'mb-3'}>
                                Bestimmte Funktionen von time-to-work senden Benachrichtigungen (über diese Webseite) an Dich.
                                <div className={'h-1'}/>
                                Du kannst in den <span className={'font-bold'}>Browser-Berechtigungen</span> diese Webseite
                                berechtigen, Dir Benachrichtigungen auch über den Browser zu senden.
                                Dadurch siehst Du Benachrichtigungen auch, wenn der Browser minimiert ist oder
                                ein anderer Tab geöffnet ist.
                            </Section>
                        </>
                    },
                    {
                        title: "Browser-Berechtigungen",
                        settings: <div className={'mt-2'}>
                            <Section className={"flex flex-col md:flex-row items-center gap-3 justify-between"}>
                                <StatusIndicator
                                    status={browserNotifications.availability.status}
                                    text={browserNotifications.availability.text}
                                />
                                <FlatButton
                                    disabled={browserNotifications.availability.value != "default"}
                                    onClick={browserNotifications.requestPermission}
                                >
                                    Berechtigung anfragen
                                </FlatButton>
                            </Section>
                        </div>
                    }
                ]}
            />
        </div>
    );
}