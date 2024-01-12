'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const linkClassNames = 'flex-grow text-center rounded-t-2xl w-4 py-2';

function NavLink({ href, currentPath, children }: { href: string, currentPath: string, children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={clsx(
        linkClassNames,
        {
          'bg-ckpc-buff-verylight': currentPath === href,
          'bg-ckpc-buff-light': currentPath !== href,
        }
      )}
    >
      {children}
    </Link>
  );
}

export default function NavBar() {
  const currentPath = usePathname();
  return (
    <nav className='flex flex-row bg-ckpc-buff'>
      <NavLink href='/ckpc31' currentPath={currentPath}>
        簡介
      </NavLink>
      <NavLink href='/ckpc31/story' currentPath={currentPath}>
        劇情
      </NavLink>
      <NavLink href='/ckpc31/inventory' currentPath={currentPath}>
        歷史碎片
      </NavLink>
    </nav>
  );
}