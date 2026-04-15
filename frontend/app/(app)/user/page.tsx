import React from 'react'
import { redirect } from 'next/navigation'

function page() {
  return redirect('/user/dashboard')
}

export default page
