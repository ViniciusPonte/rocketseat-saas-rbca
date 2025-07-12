import { ability, getCurrentOrg } from '@/auth/auth'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { getMembers } from '@/http/members/get-members'
import { getOrganization } from '@/http/organization/get-organization'
import { getProfile } from '@/http/user/get-profile'
import { ArrowLeftRight, Crown, UserMinus } from 'lucide-react'
import Image from 'next/image'
import { organizationSchema } from '@saas/auth'
import { removeMemberAction } from '../actions'
import { UpdateMemberRoleSelect } from '@/components/update-member-role-select'

export async function MemberList() {
  const currentOrg = await getCurrentOrg()
  const permissions = await ability()

  const [{ members }, { user }, { organization }] = await Promise.all([
    getMembers(currentOrg!),
    getProfile(),
    getOrganization(currentOrg!),
  ])

  const authOrganization = organizationSchema.parse(organization)

  const canTransferOrg = permissions?.can(
    'transfer_ownership',
    authOrganization
  )

  const canDeleteUser = permissions?.can('delete', 'User')

  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold">Members</h2>

      <div className="rounded border">
        <Table>
          <TableBody>
            {members.map((member) => {
              const isSameUserAsLogged =
                member.userId === user.id || member.id === organization.ownerId

              return (
                <TableRow key={member.id}>
                  <TableCell className="py-2.5" style={{ width: 48 }}>
                    <Avatar>
                      <AvatarFallback />
                      {member.avatarUrl && (
                        <Image
                          src={member.avatarUrl}
                          width={32}
                          height={32}
                          alt=""
                          className="aspect-square size-full"
                        />
                      )}
                    </Avatar>
                  </TableCell>
                  <TableCell className="py-2.5">
                    <div className="flex flex-col">
                      <span className="inline-flex items-center gap-2 font-medium">
                        {member.name}
                        {member.userId === user.id && ' (me)'}
                        {organization.ownerId === member.userId && (
                          <span className="text-muted-foreground inline-flex items-center gap-1 text-sm">
                            <Crown className="size-3" />
                            Owner
                          </span>
                        )}
                      </span>
                      <span className="text-muted-foreground text-xs">
                        {member.email}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="py-2.5">
                    <div className="flex items-center justify-end gap-2">
                      {canTransferOrg && (
                        <Button size="sm" variant="ghost">
                          <ArrowLeftRight className="mr-2 size-4" />
                          Transfer Ownership
                        </Button>
                      )}

                      <UpdateMemberRoleSelect
                        disabled={
                          isSameUserAsLogged ||
                          permissions?.cannot('update', 'User')
                        }
                        memberId={member.id}
                        value={member.role}
                      />

                      {canDeleteUser && (
                        // <form action={() => removeMemberAction(member.id)}>
                        <form action={removeMemberAction.bind(null, member.id)}>
                          <Button
                            disabled={isSameUserAsLogged}
                            type="submit"
                            size="sm"
                            variant="destructive"
                          >
                            <UserMinus />
                            Remove
                          </Button>
                        </form>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
