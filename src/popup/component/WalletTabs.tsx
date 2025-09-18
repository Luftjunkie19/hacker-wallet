import { Box } from '@radix-ui/themes/dist/cjs/components/box'
import { Tabs

 } from 'radix-ui'
import React from 'react'

import { MdGeneratingTokens } from "react-icons/md";

import { RiNftFill } from "react-icons/ri";
import { RxActivityLog } from "react-icons/rx";
import NFTsByWallet from './NFTsByWallet';
import TokensByWallet from './TokensByWallet';
import TransactionHistory from './TransactionHistory';


type Props = {}

function WalletTabs({}: Props) {
  return (
<Tabs.Root defaultValue="
tokens
">
	<Tabs.List
	className='
	plasmo-w-full plasmo-text-white plasmo-flex plasmo-items-center plasmo-gap-4 
	'
	>
		<Tabs.Trigger
			className='
		plasmo-flex plasmo-items-center plasmo-gap-2
		'
		value="tokens">
			<MdGeneratingTokens/>
			
			Tokens</Tabs.Trigger>
		<Tabs.Trigger
			className='
		plasmo-flex plasmo-items-center plasmo-gap-2
		'
		value="nfts">
			<RiNftFill/>

			NFTs
		</Tabs.Trigger>

		<Tabs.Trigger
		className='
		plasmo-flex plasmo-items-center plasmo-gap-2
		'
		value="activity">
			<RxActivityLog/>
			Activity

		</Tabs.Trigger>
	</Tabs.List>

	<Box pt="3">
		<Tabs.Content value="tokens">
		<TokensByWallet/>
		</Tabs.Content>

		<Tabs.Content value="nfts">
		<NFTsByWallet/>
		</Tabs.Content>

		<Tabs.Content value="activity">
			<TransactionHistory/>
		</Tabs.Content>
	</Box>
</Tabs.Root>
  )
}

export default WalletTabs