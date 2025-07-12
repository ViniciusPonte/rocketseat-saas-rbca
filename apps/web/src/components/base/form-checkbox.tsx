import { Checkbox } from '../ui/checkbox'

type FormCheckboxProps = {
  label: string
  description?: string
  error?: string
  defaultChecked?: boolean
} & React.InputHTMLAttributes<HTMLInputElement>

export function FormCheckbox({
  label,
  name,
  description,
  defaultChecked,
}: FormCheckboxProps) {
  return (
    <div className="space-y-1">
      <div className="flex items-baseline space-x-2">
        <Checkbox
          name={name}
          id={name}
          className="translate-y-0.5"
          defaultChecked={defaultChecked}
        />
        <label htmlFor={name} className="space-y-1">
          <span className="text-sm leading-none font-medium">{label}</span>
          {description && (
            <p className="text-muted-foreground text-sm">{description}</p>
          )}
        </label>
      </div>
    </div>
  )
}
