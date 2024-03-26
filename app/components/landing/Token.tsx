import { ReactNode } from 'react'

export const Token = ({
  iconSrc,
  text,
  isActive
}: {
  iconSrc: string,
  text: string,
  isActive: bool
}) => {
  return (
    <div className={`flex flex-col items-center justify-center ${!isActive ? 'opacity-40' : ''}`}>
      <img src={iconSrc} width='60px' />
      <div className="text-sm mt-2 md:text-xl text-black text-center">{text}</div>
      {!isActive && <div className='text-center'>
        <div className='text-red-500 text-xs sm:text-base'>• Soon</div>
      </div>}
    </div>
  )
}
