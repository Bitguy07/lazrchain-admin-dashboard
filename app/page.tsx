// app/page.tsx
import { redirect } from 'next/navigation'

export default function Home() {
  redirect('/lazrchain-dashboard') // or any other group route
}
