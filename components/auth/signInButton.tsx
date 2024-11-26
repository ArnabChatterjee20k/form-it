import { getSignInUrl } from '@workos-inc/authkit-nextjs'
import Link from 'next/link'
export default async function SignInButton() {
  const url = await getSignInUrl()
  return <Link href={url}>signInButton</Link>
}