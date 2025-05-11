import Button from "@/components/primitives/control/Button";
import { MaterialSymbols } from "@/icon/MaterialSymbols";
import MaterialSymbol from "@/components/icon/MaterialSymbol";


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
            <MaterialSymbol
                symbol={MaterialSymbols.SETTINGS}
                weight={300}
                className={'size-7'}
            />
        </Button>
    );
}