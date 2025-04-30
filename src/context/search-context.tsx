
import React from 'react'
import { CommandMenu } from '@/components/command-menu'
import { NavItem } from '@/types'
import { navItems } from '@/constants/data'
import { useNavigate } from 'react-router-dom'


interface SearchContextType {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const SearchContext = React.createContext<SearchContextType | null>(null)

interface Props {
  children: React.ReactNode
}

export function SearchProvider({ children }: Props) {
  const [open, setOpen] = React.useState(false)
  const navigate = useNavigate()

  // Flatten all nav items for shortcut handling
  const flattenItems = (items: NavItem[]): NavItem[] => {
    return items.reduce<NavItem[]>((acc, item) => {
      if (item.items && item.items.length > 0) {
        return [...acc, ...flattenItems(item.items)]
      }
      return [...acc, item]
    }, [])
  }

  const allNavItems = flattenItems(navItems)

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      // Command menu toggle
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
        return
      }

      // Don't trigger if typing in an input
      if (document.activeElement instanceof HTMLInputElement) return

      // Global shortcuts (double key press)
      if (!e.ctrlKey && !e.metaKey && !e.altKey && !e.shiftKey) {
        const matchingItem = allNavItems.find(
          item => item.shortcut &&
            item.shortcut.length === 2 &&
            item.shortcut[0] === e.key.toLowerCase()
        )

        if (matchingItem) {
          e.preventDefault()
          navigate(matchingItem.url)
        }
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [navigate, allNavItems])

  return (
    <SearchContext.Provider value={{ open, setOpen }}>
      {children}
      <CommandMenu />
    </SearchContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useSearch = () => {
  const searchContext = React.useContext(SearchContext)

  if (!searchContext) {
    throw new Error('useSearch has to be used within <SearchContext.Provider>')
  }

  return searchContext
}