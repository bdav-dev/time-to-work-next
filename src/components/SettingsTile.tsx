import Elevation from "@/components/layout/Elevation";
import React from "react";


type SettingsTileProps = {
    children: React.ReactNode;
    title: string;
}
export default function SettingsTile(props: SettingsTileProps) {

    return (
        <Elevation className={"min-w-[17rem] min-h-[17rem] size-[17rem] flex flex-col"}>
            <div className={"underline underline-offset-2 text-center font-bold text-lg"}>
                {props.title}
            </div>

            <div className={" flex-1"}>
                {props.children}
            </div>
        </Elevation>
    )

}