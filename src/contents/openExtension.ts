import type { PlasmoCSConfig } from "plasmo"
 
import { relayMessage } from "@plasmohq/messaging"
 
export const config: PlasmoCSConfig = {
  matches: ["http://www.plasmo.com/*"] // Only relay messages from this domain
}
 
relayMessage({
  name: "openExtension" as never
})