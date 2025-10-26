import type { PlasmoMessaging } from "@plasmohq/messaging"
 
const handler: PlasmoMessaging.PortHandler = async (req, res) => {
 try {
  if(req.body.type === 'response'){
    res.send(req.body);
  }

 } catch (error) {
 console.log(error);
 }
}
 
export default handler