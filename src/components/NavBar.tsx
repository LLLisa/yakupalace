import { NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/calculator', label: 'Calculator' },
  { to: '/articles', label: 'Articles' },
  { to: '/table', label: 'Table builder' },
]

export function NavBar() {
  return (
    <header className="bg-brand text-brand-fg">
      <nav className="w-full max-w-5xl mx-auto px-4 h-14 flex items-center gap-6">
        <span className="font-bold text-lg tracking-tight">雀 Yaku Palace</span>
        <ul className="flex gap-4 text-sm">
          {links.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `py-1 border-b-2 transition-colors ${
                    isActive
                      ? 'border-brand-fg'
                      : 'border-transparent hover:border-brand-fg/50'
                  }`
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
