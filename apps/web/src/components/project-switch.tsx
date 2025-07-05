'use client'

import { ChevronsUpDown, Loader2, PlusCircle } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { use } from 'react'
import { getProjects } from '@/http/get-projects'
import { useQuery } from '@tanstack/react-query'
import { Skeleton } from './ui/skeleton'

export function ProjectSwitch() {
  const { slug: orgSlug, project: projSlug } = useParams<{
    slug: string
    project: string
  }>()

  // const projects = use(getProjects(orgSlug)) <- exemplo de uso do hook use, novo do React 19

  const { data, isLoading } = useQuery({
    queryFn: () => getProjects(orgSlug),
    queryKey: [orgSlug, 'projects'],
    enabled: !!orgSlug,
  })

  const currentProject =
    data && projSlug
      ? data.projects.find((proj) => proj.slug === projSlug)
      : null

  const renderCurrentProject = () => {
    if (currentProject) {
      return (
        <>
          <Avatar className="size-4">
            {currentProject.avatarUrl && (
              <AvatarImage src={currentProject.avatarUrl} />
            )}
            <AvatarFallback />
          </Avatar>
          <span className="truncate text-left">{currentProject.name}</span>
        </>
      )
    }

    return <span className="text-muted-foreground">Select project</span>
  }

  const renderSkeleton = () => {
    return (
      <>
        <Skeleton className="size-4 shrink-0 rounded-full" />
        <Skeleton className="h-4 w-full" />
      </>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus-visible:ring-primary flex w-[168px] items-center gap-2 rounded p-1 text-sm font-medium outline-none focus-visible:ring-2">
        {isLoading ? renderSkeleton() : renderCurrentProject()}
        {isLoading ? (
          <Loader2 className="text-muted-foreground ml-auto size-4 shrink-0 animate-spin" />
        ) : (
          <ChevronsUpDown className="text-muted-foreground ml-auto size-4 shrink-0" />
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        alignOffset={-16}
        sideOffset={12}
        className="w-[200px]"
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel>Projects</DropdownMenuLabel>
          {data &&
            data.projects.map((project) => {
              return (
                <DropdownMenuItem key={project.id} asChild>
                  <Link href={`/org/${orgSlug}/project/${project.slug}`}>
                    <Avatar className="mr-2 size-4">
                      {project.avatarUrl && (
                        <AvatarImage src={project.avatarUrl} />
                      )}
                      <AvatarFallback />
                    </Avatar>
                    <span className="line-clamp-1">{project.name}</span>
                  </Link>
                </DropdownMenuItem>
              )
            })}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={`/org/${orgSlug}/create-project`}>
            <PlusCircle className="mr-2 size-4" /> Create new
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
