'use client'

import { FormInput } from '@/components/base/form-input'
import { Button } from '@/components/ui/button'
import { useFormState } from '@/hooks/use-form-state'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertTriangle, Loader2, UserPlus } from 'lucide-react'
import { createInviteAction } from '../actions'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function CreateInviteForm() {
  const [formState, handleSubmit, isPending] = useFormState(createInviteAction)

  const { errors, message, success } = formState

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {!success && message && (
        <Alert variant="destructive">
          <AlertTriangle className="size-4" />
          <AlertTitle>Invite failed!</AlertTitle>
          <AlertDescription>
            <p>{message}</p>
          </AlertDescription>
        </Alert>
      )}

      <div className="flex items-center gap-2">
        <FormInput
          name="email"
          placeholder="john@example.com"
          error={errors?.email && errors?.email[0]}
          className="flex-1 space-y-1"
        />

        <Select name="role" defaultValue="MEMBER">
          <SelectTrigger className="h-8 w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ADMIN">Admin</SelectItem>
            <SelectItem value="MEMBER">Member</SelectItem>
            <SelectItem value="BILLING">Billing</SelectItem>
          </SelectContent>
        </Select>

        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <Loader2 />
          ) : (
            <>
              <UserPlus className="mr-2 size-4" />
              Invite User
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
