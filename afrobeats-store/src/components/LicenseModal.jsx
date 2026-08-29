import {
  Check,
  Crown,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react'

export default function LicenseModal({
  beat,
  licenses,
  selectedLicense,
  setSelectedLicense,
  onClose,
  onContinue,
}) {
  if (!beat) {
    return null
  }

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center sm:p-5"
      onClick={onClose}
    >
      <div
        className="max-h-[92vh] w-full overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:max-w-5xl sm:rounded-3xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white/95 px-5 py-4 backdrop-blur-xl sm:px-7">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-purple-600">
              Choose your license
            </p>

            <h2 className="mt-1 truncate text-xl font-black text-slate-900 sm:text-2xl">
              {beat.title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="ml-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-slate-200"
            aria-label="Close license selector"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-5 sm:p-7">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {licenses.map((license) => {
              const isSelected = selectedLicense?.id === license.id

              return (
                <button
                  key={license.id}
                  type="button"
                  onClick={() => setSelectedLicense(license)}
                  className={`relative flex h-full flex-col rounded-2xl border p-5 text-left transition ${
                    isSelected
                      ? 'border-purple-600 bg-purple-50 shadow-lg shadow-purple-100'
                      : 'border-slate-200 bg-white hover:border-purple-300 hover:shadow-md'
                  }`}
                >
                  
                 
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-black text-slate-900">
                        {license.name}
                      </h3>

                      <p className="mt-1 text-sm leading-5 text-slate-500">
                        {license.description}
                      </p>
                    </div>

                    <div
                      className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                        isSelected
                          ? 'border-purple-600 bg-purple-600 text-white'
                          : 'border-slate-300'
                      }`}
                    >
                      {isSelected && <Check size={13} />}
                    </div>
                  </div>

                  <div className="mt-5">
                    <span className="text-2xl font-black text-slate-900">
                      ₦{license.priceNGN.toLocaleString()}
                    </span>
                  </div>

                  <div className="my-5 border-t border-slate-200" />

                  <ul className="space-y-3">
                    {license.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2.5 text-sm text-slate-600"
                      >
                        <Check
                          size={16}
                          className="mt-0.5 shrink-0 text-purple-600"
                        />

                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </button>
              )
            })}
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:flex sm:items-center sm:justify-between sm:gap-6">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 rounded-xl bg-purple-100 p-2 text-purple-600">
                <ShieldCheck size={18} />
              </div>

              <div>
                <p className="text-sm font-bold text-slate-900">
                  License terms apply
                </p>

                <p className="mt-1 max-w-xl text-xs leading-5 text-slate-500">
                  Your selected license determines the permitted usage,
                  distribution and streaming limits for this beat.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onContinue}
              disabled={!selectedLicense}
              className="mt-4 w-full rounded-xl bg-purple-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-purple-500 disabled:cursor-not-allowed disabled:bg-slate-300 sm:mt-0 sm:w-auto sm:min-w-44"
            >
              Add to cart
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}