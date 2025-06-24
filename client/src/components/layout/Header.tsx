import { Button } from 'primereact/button'
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

const Header = () => {
  return (
     <div className="bg-blue-600 text-white p-1 pl-2 text-lg flex justify-content-between shadow-2 align-items-center">
        <Link href={"/"}><Image src="/icons/dux-50.png" alt="Dux Software"  width={35} height={35}/></Link>
        <Button icon="pi pi-cog"  aria-label="Configuración" text className='text-white'/>
    </div>
  )
}

export default Header