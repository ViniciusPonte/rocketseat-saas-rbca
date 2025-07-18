import { Label } from '../ui/label'
import { Input } from '../ui/input'
import type React from 'react'
import { Textarea } from '../ui/textarea'
import { twMerge } from 'tailwind-merge'

type FormInputProps = {
  label?: string
  error?: string
  isTextArea?: boolean
  children?: React.ReactNode
} & React.InputHTMLAttributes<HTMLInputElement>

export function FormInput({
  label,
  name,
  type,
  error,
  isTextArea = false,
  children,
  ...props
}: FormInputProps) {
  return (
    <div className={twMerge('space-y-2', props.className)}>
      {label && <Label htmlFor={name}>{label}</Label>}
      {isTextArea ? (
        <Textarea name={name} id={name} />
      ) : (
        <Input name={name} type={type ?? 'text'} id={name} {...props} />
      )}

      {error && (
        <p className="text-sm font-medium text-red-500 dark:text-red-400">
          {error}
        </p>
      )}

      {children}
    </div>
  )
}
