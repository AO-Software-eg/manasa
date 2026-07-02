import React from 'react';
import { ReactNode } from 'react';

function CardLayout({
  children,
  classname,
}: {
  children: ReactNode;
  classname?: string;
}) {
  return (
    <div
      className={`bg-card text-foreground w-full p-6 border rounded-3xl border-border/80 shadow-sm transition-all duration-300 ${classname} `}
    >
      {children}
    </div>
  );
}

export default CardLayout;
