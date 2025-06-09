import NeumorphicButton from "@/components/primitives/neumorphic/NeumorphicButton";
import { NeumorphicBlueprintFactory } from "@/neumorphic/NeumorphicStyle";
import { ReactNode, useEffect, useRef, useState } from "react";
import HorizontalRuler from "@/components/layout/HorizontalRuler";

type MenuItem = {
    label: ReactNode,
    action: () => void,
    closeMenuAfterAction?: boolean
};

type MenuProps = {
    sections: MenuItem[][],
    overridePadding?: boolean,
    circular?: boolean,
    children?: ReactNode,
    buttonClassName?: string,
    menuPosition?: 'right' | 'bottom',
    overrideMargin?: boolean,
    className?: string
}

export default function Menu(props: MenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const handleClickOutside = (event: MouseEvent) => {
        if (!menuRef.current?.contains(event?.target as Node)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        if (isOpen) document.addEventListener("mousedown", handleClickOutside);
        else document.removeEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    const blueprint = NeumorphicBlueprintFactory.createMedium();
    blueprint.margin = 0;
    if (isOpen) {
        blueprint.inverted = true;
    }

    return (
        <div className={`relative w-fit ${!props.overrideMargin && 'm-2.5'} ${props.className}`} ref={menuRef}>
            <NeumorphicButton
                blueprint={blueprint}
                className={`
                    flex items-center justify-center
                    ${!props.overridePadding && 'p-2'}
                    ${props.circular ? 'rounded-full' : 'rounded-xl'}
                    ${props.buttonClassName}
                `}
                onClick={() => setIsOpen(current => !current)}
            >
                {props.children}
            </NeumorphicButton>

            <div
                className={`
                    absolute ${!isOpen && "hidden"} 
                    flex flex-col gap-2 
                    p-2 rounded-xl 
                    ${
                        {
                            'right': 'top-0 -right-1 translate-x-full',
                            'bottom': 'left-0 translate-y-1'
                        }[props.menuPosition ?? 'right']
                    }
                    border 
                    bg-neumorphic-100 border-neumorphic-300
                    dark:bg-neumorphic-800 dark:border-neumorphic-700
                    shadow-lg
                    shadow-white-neumorphic-accent-shadow dark:shadow-gray-neumorphic-accent-shadow
                `}
            >
                {
                    props.sections.map(
                        (section, index) => <div key={index} className={"flex flex-col gap-2"}>

                            {
                                index != 0 &&
                                <HorizontalRuler/>
                            }
                            {
                                section.map(
                                    (menuItem, index) => <MenuItemComponent key={index} menuItem={menuItem} closeMenu={() => setIsOpen(false)}/>
                                )
                            }
                        </div>
                    )
                }
            </div>
        </div>
    );
}

function MenuItemComponent({ menuItem, closeMenu }: { menuItem: MenuItem, closeMenu: () => void }) {
    return (
        <button
            className={`
                flex flex-row items-center w-full max-w-[30rem]
                py-1 px-2 rounded-lg
                hover:bg-neumorphic-200 hover:dark:bg-neumorphic-700
                transition-colors duration-75
            `}
            onClick={() => {
                menuItem.action();
                if (menuItem.closeMenuAfterAction ?? true) {
                    closeMenu();
                }
            }}
        >
            {menuItem.label}
        </button>
    );
}
