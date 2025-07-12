import { ability, getCurrentOrg } from '@/auth/auth'
import { ProjectList } from './components/project-list'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function Projects() {
  const currentOrg = await getCurrentOrg()
  const permissions = await ability()

  const canCreateProjects = permissions?.can('create', 'Project')
  const canListProjects = permissions?.can('get', 'Project')

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Projects</h1>
        {canCreateProjects && (
          <Button asChild>
            <Link href={`/org/${currentOrg}/create-project`}>
              <Plus className="mr-2 size-4" /> Create project
            </Link>
          </Button>
        )}
      </div>

      {canListProjects ? (
        <ProjectList />
      ) : (
        <p className="text-muted-foreground text-sm">
          You are not allowed to see organization projects.
        </p>
      )}
    </div>
  )
}
