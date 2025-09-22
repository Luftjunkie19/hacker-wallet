import { DropdownMenu } from 'radix-ui'
import React from 'react'
import { FaExternalLinkAlt } from 'react-icons/fa'
import { FaGear } from 'react-icons/fa6'
import { IoLogOut } from 'react-icons/io5'
import { RiGitRepositoryPrivateFill } from 'react-icons/ri'

type Props = {
    openSensitiveModal:()=>void,
    logoutFromWallet: ()=>Promise<void>

}

function SettingsDropDown({openSensitiveModal, logoutFromWallet}: Props) {
  return (
 <DropdownMenu.Root>
    <DropdownMenu.Trigger>
    <button>
     <FaGear
     className='
     plasmo-text-secondary
     plasmo-text-2xl
     '
     />
 </button>
 
    </DropdownMenu.Trigger>
    <DropdownMenu.Content className='plasmo-bg-accent plasmo-justify-between plasmo-mr-16 plasmo-mt-6 plasmo-h-64 plasmo-overflow-auto plasmo-max-w-52 plasmo-w-full plasmo-flex plasmo-flex-col plasmo-gap-2 plasmo-text-white plasmo-p-3 plasmo-rounded-lg plasmo-border plasmo-border-secondary'>
    <div className="plasmo-flex plasmo-flex-col plasmo-gap-3">
        <DropdownMenu.Item onClick={openSensitiveModal} className='plasmo-flex plasmo-outline-none plasmo-items-center plasmo-cursor-pointer plasmo-gap-2
      hover:plasmo-text-secondary plasmo-transition-all
     hover:plasmo-scale-95
     '>
     <RiGitRepositoryPrivateFill />    Reveal Private Key
             </DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Item className='plasmo-flex plasmo-items-center plasmo-outline-none plasmo-cursor-pointer
      hover:plasmo-text-secondary plasmo-transition-all
     hover:plasmo-scale-95
     plasmo-gap-2'>
       <FaExternalLinkAlt/>
               Network's Explorer
             </DropdownMenu.Item>
   </div>
 
 
        <DropdownMenu.Item
     onClick={logoutFromWallet}
     className='plasmo-flex plasmo-outline-none plasmo-items-center plasmo-cursor-pointer plasmo-gap-2
      hover:plasmo-text-red-500 plasmo-transition-all
     hover:plasmo-scale-95
     '>
     <IoLogOut />   Logout
             </DropdownMenu.Item>
        
    </DropdownMenu.Content>
 </DropdownMenu.Root>
  )
}

export default SettingsDropDown