import { ability, getCurrentOrg } from '@/auth/auth'
import { OrganizationForm } from '@/components/organization-form'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ShutdownOrganizationButton } from './shutdown-organization-button'
import { getOrganization } from '@/http/organization/get-organization'

export default async function Settings() {
  const permissions = await ability()
  const currentOrg = await getCurrentOrg()

  const canUpdateOrganization = permissions?.can('update', 'Organization')
  const canGetBilling = permissions?.can('get', 'Billing')
  const canShutdownOrganization = permissions?.can('delete', 'Organization')

  const { organization } = await getOrganization(currentOrg!)

  const organizationInitialData = {
    name: organization?.name ?? '',
    domain: organization?.domain ?? '',
    shouldAttachUsersByDomain: organization?.shouldAttachUsersByDomain,
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Settings</h1>

      <div className="space-y-4">
        {canUpdateOrganization && (
          <Card>
            <CardHeader>
              <CardTitle>Organization settings</CardTitle>
              <CardDescription>
                Update your organization details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <OrganizationForm
                isUpdating
                initialData={organizationInitialData}
              />
            </CardContent>
          </Card>
        )}
        {canGetBilling && <div>billing</div>}
        {canShutdownOrganization && (
          <Card>
            <CardHeader>
              <CardTitle>Shutdown organization</CardTitle>
              <CardDescription>
                This will delete all organization data, including all projects.
                You cannot undo this action.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ShutdownOrganizationButton />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
