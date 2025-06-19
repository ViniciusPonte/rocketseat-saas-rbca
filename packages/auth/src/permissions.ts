import type { AbilityBuilder } from '@casl/ability'
import type { AppAbility } from '.'
import type { IUser } from './models/user'
import type { Role } from './roles'

type PermissionsByRole = (
  user: IUser,
  builder: AbilityBuilder<AppAbility>
) => void

export const permissions: Record<Role, PermissionsByRole> = {
  ADMIN: (user, { can, cannot }) => {
    can('manage', 'all')
    cannot(['transfer_ownership', 'update'], 'Organization')
    can(['transfer_ownership', 'update'], 'Organization', {
      ownerId: { $eq: user.id },
    }) // A partir do momento que voce da permissão de tudo, o CASL não permite condicionais
  },
  MEMBER: (user, { can }) => {
    can('get', 'User')
    can(['get', 'create'], 'Project')
    can(['update', 'delete'], 'Project', { ownerId: { $eq: user.id } })
  },
  BILLING: (_, { can }) => {
    can('manage', 'Billing')
  },
}
