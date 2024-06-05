import { ArrowUpRight } from '~/components/Icons'

export const ExitContent = () => {
  return (
    <div className="bg-[#00260d] border-2 border-[#0bff72] text-center text-white rounded-b-2xl py-8 px-4 text-xl font-medium">
      <div className='flex flex-col'>
        <div className='px-3 py-2 bg-[#ccb142] rounded-xl flex flex-row items-center'>
          <svg stroke="#00260d" fill="#00260d" strokeWidth="0" viewBox="0 0 512 512" focusable="false" className="w-6 h-6 flex-shrink-0" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke-linecap="round" stroke-linejoin="round" strokeWidth="32" d="M85.57 446.25h340.86a32 32 0 0028.17-47.17L284.18 82.58c-12.09-22.44-44.27-22.44-56.36 0L57.4 399.08a32 32 0 0028.17 47.17z"></path><path fill="none" stroke-linecap="round" stroke-linejoin="round" strokeWidth="32" d="M250.26 195.39l5.74 122 5.73-121.95a5.74 5.74 0 00-5.79-6h0a5.74 5.74 0 00-5.68 5.95z"></path><path d="M256 397.25a20 20 0 1120-20 20 20 0 01-20 20z"></path></svg>
          <div className='text-sm text-[#00260d]'>
            Unstake requests are processed within 7-10 days, subject to exit queue on beacon chain and delays imposed by EigenLayer
          </div>
        </div>
        <div className='flex flex-col mt-8'>
          <div className='text-xl font-bold'>
            No unstake requests found
          </div>
          <div className='text-base'>
            You will be able to withdraw after the Unstake request has been processed. In order to Unstake go to Unstake tab.
          </div>
        </div>
      </div>
    </div>
  )
}
