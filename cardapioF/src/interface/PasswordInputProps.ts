export interface PasswordInputProps {
    label: string,
    value: string,
    updateValue(value: any): void,
    error?: string
}