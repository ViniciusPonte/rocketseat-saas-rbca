import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { FormInput } from '@/components/base/form-input'

export default function ForgotPasswordPage() {
  return (
    <form action="" className="space-y-4">
      <FormInput name="email" type="email" label="E-mail" />

      <Button type="submit" className="w-full">
        Recover password
      </Button>

      <Button type="button" variant="link" className="w-full" size="sm" asChild>
        <Link href="/auth/sign-in">Back to login</Link>
      </Button>
    </form>
  )
}
