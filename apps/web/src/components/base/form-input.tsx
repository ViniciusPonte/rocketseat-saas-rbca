import { Label } from '../ui/label'
import { Input } from '../ui/input'
import type React from 'react'

type FormInputProps = {
  label: string
  error?: string
  children?: React.ReactNode
} & React.InputHTMLAttributes<HTMLInputElement>

export function FormInput({
  label,
  name,
  type,
  error,
  children,
}: FormInputProps) {
  return (
    <div className="space-y-1">
      <Label htmlFor={name}>{label}</Label>
      <Input name={name} type={type ?? 'text'} id={name} />

      {error && (
        <p className="text-sm font-medium text-red-500 dark:text-red-400">
          {error}
        </p>
      )}

      {children}
    </div>
  )
}
