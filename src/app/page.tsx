import Button from "@/components/buttons/Button";
import SmallButton from "@/components/buttons/SmallButton";
import Elevation from "@/components/layout/Elevation";
import SettingsTile from "@/components/SettingsTile";

export default function TimeToWork() {
    return (
        <div>
            <Button>test</Button>
            <SmallButton>test2</SmallButton>


            <div className="flex flex-col xl:flex-row gap-4">
                <div className={`
                            min-w-0
                            flex flex-row gap-4
                            justify-center w-full
                            xl:ml-auto xl:w-fit
                        `}>
                    <SettingsTile title={"Zeitstempel"}>test</SettingsTile>
                    <SettingsTile title={"Zeitintervall"}>test</SettingsTile>
                </div>

                <div className={`
                            flex flex-row gap-4
                            justify-center w-full
                            xl:mr-auto xl:w-fit
                        `}>
                    <SettingsTile title={"Einstellungen"}>test</SettingsTile>
                    <SettingsTile title={"Zug"}>test</SettingsTile>
                </div>

            </div>


            <Elevation className={"w-fit"}>
                hello world
            </Elevation>


        </div>
    );
}
