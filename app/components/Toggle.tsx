import React from 'react'
import { Link, useLocation } from 'react-router-dom'

interface ToggleProps {
  tabs: {
    label: string
    href: string
  }[]
  className?: string
  activeTab: number
  onChanged: (idx: number) => void
}

export const Toggle = (props: ToggleProps) => {
  const location = useLocation()
  // const activeTab = props.tabs.findIndex(
  //   (tab) => location.pathname === tab.href,
  // )

  const base =
    'text-center rounded text-xl font-semibold w-full py-4 focus:outline-none cursor-pointer'
  const active = `${base} bg-[#44cb68] border border-[#45ff76] text-white`
  const inactive = `${base} bg-[#001f0b] border border-[#45ff76] text-[#45ff76]`

  return (
    <>
      {props.tabs.map((tab, idx) => (
        <div
          key={idx}
          className={props.activeTab === idx ? active : inactive}
          onClick={() => props.onChanged(idx)}
        >
          {tab.label}
        </div>
      ))}
    </>
  )
}
