import styles from './SmallButton.module.css'
import { ButtonProps } from "@/components/buttons/Button";

export default function SmallButton({ className, children, ...rest }: ButtonProps) {
    return (
        <button className={`${styles.smallNeumorphicButton} ${className}`} {...rest}>
            {children}
        </button>
    )
}
