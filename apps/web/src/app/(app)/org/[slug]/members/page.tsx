import { ability } from '@/auth/auth'
import { Invites } from './components/invites'
import { MemberList } from './components/member-list'

export default async function MembersPage() {
  const permissions = await ability()

  const canGetInvites = permissions?.can('get', 'Invite')
  const canGetMembers = permissions?.can('get', 'User')

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Members</h1>
      <div className="space-y-4">
        {canGetInvites && <Invites />}
        {canGetMembers && <MemberList />}
      </div>
    </div>
  )
}
