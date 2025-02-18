import styles from './Elevation.module.css'
import { HTMLAttributes } from "react";

type ElevationProps = HTMLAttributes<HTMLDivElement>;
export default function Elevation({ className, children, ...rest }: ElevationProps) {
    return (
        <div className={`${styles.neumorphic} ${className}`} {...rest}>
            {children}
        </div>
    )
}
