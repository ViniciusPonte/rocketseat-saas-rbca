import { Header } from '@/components/header'
import { OrganizationForm } from '@/components/organization-form'

export default function CreateOrganization() {
  return (
    <>
      <div className="space-y-4 py-4">
        <Header />
        <main className="mx-auto w-full max-w-[1200px]">
          <div className="space-y-4">
            <h1 className="text-2xl font-bold">Create organization</h1>

            <OrganizationForm />
          </div>
        </main>
      </div>
    </>
  )
}
