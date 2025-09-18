import { DropdownMenu } from 'radix-ui';
import React from 'react'
import {FaGlobe} from "react-icons/fa";
import { useAppSelector } from '~popup/state-managment/ReduxWrapper';
type Props = {}

function Header({}: Props) {
    const isLoggedIn= useAppSelector((selector)=>selector.loggedIn.encryptedWallet)

    return (
    <div className="plasmo-gap-12 plasmo-flex 
   plasmo-justify-between
    plasmo-items-center">
           <div className="self-center
           plasmo-flex plasmo-gap-2 plasmo-items-center
           ">
              <img src={require('../icon.png')} width={56}height={56}className="plasmo-w-14 plasmo-h-14 plasmo-rounded-lg" alt="HackerWallet Logo" />
        <p className="plasmo-text-xl plasmo-text-center plasmo-font-bold plasmo-text-secondary">
        HackerWallet
      </p>
      </div>

      {
isLoggedIn &&
      <div className="plasmo-flex plasmo-gap-4">

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
	<button>
    <FaGlobe
    className='
    plasmo-text-secondary
    '
    />
</button>

	</DropdownMenu.Trigger>
	<DropdownMenu.Content className='plasmo-bg-accent plasmo-text-white plasmo-p-2 plasmo-rounded-lg plasmo-border plasmo-border-secondary'>
		<DropdownMenu.Item >Edit</DropdownMenu.Item>
		<DropdownMenu.Item >Duplicate</DropdownMenu.Item>
		<DropdownMenu.Separator />
		<DropdownMenu.Item>Archive</DropdownMenu.Item>

		<DropdownMenu.Separator />
		<DropdownMenu.Item>Share</DropdownMenu.Item>
		<DropdownMenu.Item>Logout</DropdownMenu.Item>
		<DropdownMenu.Separator />
		<DropdownMenu.Item color="red">
			Delete
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>






      </div>
      }
      </div>
  )
}

export default Header