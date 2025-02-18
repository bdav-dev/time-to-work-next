import styles from './Button.module.css';
import { ButtonHTMLAttributes } from "react";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({ className, children, ...rest }: ButtonProps) {
    return (
        <button className={`${styles.neumorphicButton} ${className}`} {...rest}>
            {children}
        </button>
    )
}