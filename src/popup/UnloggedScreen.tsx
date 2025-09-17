import '~style.css'
import { Link } from "react-router-dom"

function UnloggedScreen() {
  return (

      
      <div className="plasmo-flex plasmo-self-end plasmo-justify-center plasmo-flex-col plasmo-w-full plasmo-gap-3 plasmo-items-center">

        <Link to={'/create-new'} className="plasmo-bg-secondary plasmo-text-center flex plasmo-items-center plasmo-justify-center plasmo-border plasmo-w-full plasmo-border-accent
        plasmo-font-semibold plasmo-text-sm plasmo-rounded-lg plasmo-px-4 plasmo-py-2 plasmo-text-primary hover:plasmo-border-secondary hover:plasmo-text-white
         hover:plasmo-bg-accent hover hover:plasmo-scale-95 plasmo-transition-all plasmo-duration-500">
          Create New Wallet
        </Link>



          <Link to={'/restore'} className="plasmo-bg-secondary flex plasmo-items-center plasmo-text-center plasmo-justify-center plasmo-border plasmo-w-full plasmo-border-accent
        plasmo-font-semibold plasmo-text-sm plasmo-rounded-lg plasmo-px-4 plasmo-py-2 plasmo-text-primary
         hover:plasmo-border-secondary hover:plasmo-text-white
         hover:plasmo-bg-accent hover hover:plasmo-scale-95 plasmo-transition-all plasmo-duration-500">
          Restore Wallet
        </Link>
      </div>
   
  )
}

export default UnloggedScreen