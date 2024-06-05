import { Link, useLocation } from 'react-router-dom'

interface ToggleProps {
  tabs: {
    label: string
    href: string
  }[]
  className?: string
}

export const Toggle = (props: ToggleProps) => {
  const location = useLocation()
  const activeTab = props.tabs.findIndex(
    (tab) => location.pathname === tab.href,
  )

  const base = 'text-center rounded text-xl font-semibold w-full py-4 focus:outline-none'
  const active = `${base} bg-[#44cb68] border border-[#45ff76] text-white`
  const inactive = `${base} bg-[#001f0b] border border-[#45ff76] text-[#45ff76]`
  return (
    <>
      {props.tabs.map((tab, idx) => (
        <Link
          key={idx}
          to={tab.href}
          className={activeTab === idx ? active : inactive}
        >
          {tab.label}
        </Link>
      ))}
    </>
  )
}
