import type { FastifyInstance } from 'fastify'
import { createAccount } from './auth/create-account'
import { authenticateWithPassword } from './auth/authenticate-with-password'
import { getProfile } from './auth/get-profile'
import { requestPasswordRecover } from './auth/request-password-recover'
import { resetPassword } from './auth/reset-password'
import { authenticateWithGithub } from './auth/authenticate-with-github'
import { createOrganization } from './orgs/create-organization'
import { getMembership } from './orgs/get-membership'
import { getOrganization } from './orgs/get-organization'
import { getOrganizations } from './orgs/get-organizations'
import { updateOrganization } from './orgs/update-organization'
import { shutdownOrganization } from './orgs/shutdown-organization'
import { transferOrganization } from './orgs/transfer-organization'
import { createProject } from './projects/create-project'
import { deleteProject } from './projects/delete-project'
import { getProject } from './projects/get-project'
import { getProjects } from './projects/get-projects'
import { updateProject } from './projects/update-project'
import { getMembers } from './members/get-members'
import { updateMember } from './members/update-member'
import { removeMember } from './members/remove-member'
import { createInvite } from './invites/create-invite'
import { getInvite } from './invites/get-invite'
import { getInvites } from './invites/get-invites'
import { acceptInvite } from './invites/accept-invite'
import { rejectInvite } from './invites/reject-invite'
import { revokeInvite } from './invites/revoke-invite'
import { getPendingInvites } from './invites/get-pending-invites'
import { getOrganizationBilling } from './billing/get-organization-billing'

export const routes = (app: FastifyInstance) => {
  // Auth
  app.register(createAccount)
  app.register(authenticateWithPassword)
  app.register(getProfile)
  app.register(requestPasswordRecover)
  app.register(resetPassword)
  app.register(authenticateWithGithub) //https://github.com/login/oauth/authorize?client_id=Ov23liwFAPiLoHHxnp6i&redirect_uri=http://localhost:3000/api/auth/callback&scope=user:email

  // Organizations
  app.register(createOrganization)
  app.register(getMembership)
  app.register(getOrganization)
  app.register(getOrganizations)
  app.register(updateOrganization)
  app.register(shutdownOrganization)
  app.register(transferOrganization)

  // Projects
  app.register(createProject)
  app.register(deleteProject)
  app.register(getProject)
  app.register(getProjects)
  app.register(updateProject)

  // Members
  app.register(getMembers)
  app.register(updateMember)
  app.register(removeMember)

  // Invites
  app.register(createInvite)
  app.register(getInvite)
  app.register(getInvites)
  app.register(acceptInvite)
  app.register(rejectInvite)
  app.register(revokeInvite)
  app.register(getPendingInvites)

  // Billing
  app.register(getOrganizationBilling)
}
