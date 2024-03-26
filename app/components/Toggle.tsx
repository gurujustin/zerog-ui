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

  const base = 'text-center rounded text-base font-semibold w-full py-4 focus:outline-none'
  const active = `${base} bg-gray-800 text-white`
  const inactive = `${base} bg-gray-500 bg-opacity-10 text-gray-300`
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
