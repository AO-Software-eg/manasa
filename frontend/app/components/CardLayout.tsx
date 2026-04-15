import React from 'react'
import { ReactNode } from 'react';

function CardLayout({children , classname} : {children: ReactNode , classname?: string}) {
  return (
    <div className={`bg-[#1C1C18] w-full p-6 border-2 rounded-4xl border-[#3b3b34]/50 ${classname} `}>
        {children}
    </div>
  )
}

export default CardLayout
