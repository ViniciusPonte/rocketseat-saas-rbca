import rocketseatIcon from '@/assets/rocketseat-icon.svg'
import Image from 'next/image'
import { ProfileButton } from './profile-button'
import { Slash } from 'lucide-react'
import { OrganizationSwitch } from './organization-switch'

export function Header() {
  return (
    <div className="mx-auto flex max-w-[1200px] items-center justify-between">
      <div className="flex items-center gap-3">
        <Image src={rocketseatIcon} className="size-6" alt="" />

        <Slash className="text-border size-3 -rotate-[24deg]" />

        <OrganizationSwitch />
      </div>
      <div className="flex items-center gap-4">
        <ProfileButton />
      </div>
    </div>
  )
}
