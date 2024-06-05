import { Outlet } from '@remix-run/react'
import type { MetaFunction } from '@remix-run/cloudflare'

export const meta: MetaFunction = () => {
  return [
    { title: 'Zero-G' },
    { name: 'description', content: 'Welcome to Zero-G!' },
  ]
}

export default function Index() {
  return (
    <>
      <Outlet />
    </>
  )
}
