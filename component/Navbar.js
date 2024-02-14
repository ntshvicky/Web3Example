import React from 'react'
import Link from 'next/link'

const Navbar = () => {
  return (
    <div className="links">
      <Link href="/"> Moralis </Link>
      <Link href="/about"> Web3Model </Link>
      <Link href="/contact"> Metamask Native (coming soon) </Link>
    </div>
  )
}

export default Navbar
