import { ability } from '@saas/auth'

const userCanInvite = ability.can('invite', 'User')

console.log(userCanInvite)
