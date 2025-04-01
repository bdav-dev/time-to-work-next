import React from "react";
import NeumorphicDiv from "@/components/neumorphic-primitives/NeumorphicDiv";
import { NeumorphicBlueprintFactory } from "@/neumorphic/neumorphic";

type TableProps = {
    header?: (string | React.ReactNode)[] | (string | React.ReactNode),
    data: (string | React.ReactNode)[][],
    className?: string
}

export default function Table(props: TableProps) {
    const amountOfColumns = Math.max(...props.data.map(row => row.length));
    const borderClassName = 'border-neumorphic-400 dark:border-neumorphic-600';
    const headerClassName = (isFirst: boolean, isLast: boolean, columnIndex: number) => `
        text-lg p-3 dark:bg-neumorphic-800 bg-neumorphic-200
        ${isFirst && 'rounded-tl-3xl'} ${isLast && 'rounded-tr-3xl'}
        ${columnIndex != 0 && 'border-l'} ${borderClassName}
    `;

    return (
        <NeumorphicDiv blueprint={NeumorphicBlueprintFactory.createLarge()} className={'rounded-3xl'}>

            <table className={`w-full ${props.className} `}>
                {
                    props.header &&
                    <thead>
                    <tr>
                        {
                            Array.isArray(props.header)
                                ? props.header.map(
                                    (columnHeader, i) => (
                                        <th key={i}
                                            className={headerClassName(i == 0, Array.isArray(props.header) && props.header.length - 1 == i, i)}
                                        >
                                            {columnHeader}
                                        </th>
                                    )
                                )
                                : <th colSpan={amountOfColumns} className={headerClassName(true, true, 0)}>{props.header}</th>
                        }
                    </tr>
                    </thead>
                }
                <tbody>
                {
                    props.data
                        .filter(row => row.length != 0)
                        .map(
                            (row, rowIndex) => (
                                <tr key={rowIndex}
                                    className={
                                        !(rowIndex == 0 && props.header == undefined)
                                            ? `border-t ${borderClassName}`
                                            : ''
                                    }
                                >
                                    {
                                        row.map(
                                            (column, columnIndex) => (
                                                <td key={columnIndex}
                                                    className={`
                                                        p-3 text-center
                                                        ${columnIndex != 0 && `border-l ${borderClassName}`}
                                                    `}
                                                >
                                                    {column}
                                                </td>
                                            )
                                        )
                                    }
                                </tr>
                            )
                        )
                }
                </tbody>
            </table>
        </NeumorphicDiv>
    );
}
