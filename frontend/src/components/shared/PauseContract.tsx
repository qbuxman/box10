import {Shield} from "lucide-react";


const PauseContract = () => {

  return (
      <div className="max-w-4xl mx-auto p-6 space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
              <div
                  className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 bg-[#234C6A]"
              >
                  <Shield className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-[#234C6A]">
                  Gestion des pauses
              </h1>
              <p className="text-lg text-[#456882]">
                  Activez ou desactivez la mise en pause de votre contrat
              </p>
          </div>
      </div>
  )
}

export default PauseContract
