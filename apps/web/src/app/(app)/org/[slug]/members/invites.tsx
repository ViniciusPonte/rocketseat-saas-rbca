import { ability, getCurrentOrg } from '@/auth/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { getInvites } from '@/http/invites/get-invites'
import { XOctagon } from 'lucide-react'
import { RevokeInviteButton } from './revoke-invite-button'

export async function Invites() {
  const currentOrg = await getCurrentOrg()
  const permissions = await ability()
  const { invites } = await getInvites(currentOrg!)

  const canCreateInvite = permissions?.can('create', 'Invite')
  const canDeleteInvite = permissions?.can('delete', 'Invite')

  return (
    <div className="space-y-4">
      {canCreateInvite && (
        <Card>
          <CardHeader>
            <CardTitle>Invite Member</CardTitle>
          </CardHeader>
          <CardContent></CardContent>
        </Card>
      )}

      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Invites</h2>

        <div className="rounded border">
          <Table>
            <TableBody>
              {invites.map((invite) => {
                return (
                  <TableRow key={invite.id}>
                    <TableCell className="py-2.5">
                      <span className="text-muted-foreground">
                        {invite.email}
                      </span>
                    </TableCell>
                    <TableCell className="py-2.5 font-medium">
                      {invite.role}
                    </TableCell>
                    <TableCell className="py-2.5">
                      <div className="flex justify-end">
                        {canDeleteInvite && (
                          <RevokeInviteButton inviteId={invite.id} />
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}

              {invites.length === 0 && (
                <TableRow>
                  <TableCell className="text-muted-foreground text-center">
                    No invites found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
