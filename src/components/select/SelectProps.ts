type SelectProps<T> = {
    value: T,
    onValueChange: (value: T) => void,
    disabled?: boolean
}