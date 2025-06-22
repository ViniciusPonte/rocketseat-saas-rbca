import { defineAbilityFor, userSchema, type Role } from '@saas/auth'

export function getUserPermissions(userId: string, role: Role) {
  const authUser = userSchema.parse({
    id: userId,
    role: role,
  })

  const ability = defineAbilityFor(authUser)

  ability.can = ability.can.bind(ability)
  ability.cannot = ability.cannot.bind(ability)

  return ability
}
