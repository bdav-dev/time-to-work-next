import MaterialSymbol, { MaterialSymbols } from "@/icons/MaterialSymbol";
import Button from "@/components/primitives/control/Button";


type SettingsButtonProps = {
    onClick: () => void
}

export default function SettingsButton(props: SettingsButtonProps) {
    return (
        <Button
            circular
            className={'size-12 p-0 flex items-center justify-center'}
            onClick={props.onClick}
            overridePadding
        >
            <MaterialSymbol symbol={MaterialSymbols.SETTINGS} className={'text-3xl'}/>
        </Button>
    );
}