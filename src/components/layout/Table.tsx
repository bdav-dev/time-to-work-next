import { ReactNode } from "react";
import NeumorphicDiv from "@/components/primitives/neumorphic/NeumorphicDiv";
import { NeumorphicBlueprintFactory } from "@/neumorphic/NeumorphicStyle";
import { createIsLast, isFirst } from "@/util/ArrayUtils";

type TableProps = {
    header?: (ReactNode | undefined)[] | ReactNode,
    data: (ReactNode | undefined)[][],
    className?: string
}

const borderClassName = 'border-neumorphic-400 dark:border-neumorphic-600';
const headerClassName = (isFirst: boolean = true, isLast: boolean = true, columnIndex: number = 0) => `
    text-lg p-3 dark:bg-neumorphic-800 bg-neumorphic-200
    ${isFirst && 'rounded-tl-3xl'} ${isLast && 'rounded-tr-3xl'}
    ${columnIndex != 0 && 'border-l'} ${borderClassName}
`;

export default function Table(props: TableProps) {
    const header = Array.isArray(props.header) ? props.header.filter(column => column != undefined) : props.header;
    const data = props.data.map(row => row.filter(column => column != undefined));

    const isLastInHeader = createIsLast(Array.isArray(header) ? header : []);
    const amountOfColumns = Math.max(...data.map(row => row.length));

    return (
        <NeumorphicDiv blueprint={NeumorphicBlueprintFactory.createLarge()} className={'rounded-3xl'}>
            <table className={`w-full ${props.className} `}>
                {
                    header &&
                    <thead>
                    <tr>
                        {
                            Array.isArray(header)
                                ? header.map(
                                    (columnHeader, i) => (
                                        <th key={i} className={headerClassName(isFirst(i), isLastInHeader(i), i)}>
                                            {columnHeader}
                                        </th>
                                    )
                                )
                                : <th colSpan={amountOfColumns} className={headerClassName()}>{header}</th>
                        }
                    </tr>
                    </thead>
                }
                <tbody>
                {
                    data
                        .filter(row => row.length != 0)
                        .map(
                            (row, rowIndex) => (
                                <tr key={rowIndex} className={`border-t ${borderClassName}`}>
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
