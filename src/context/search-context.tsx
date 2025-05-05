import React from 'react'
import { CommandMenu } from '@/components/command-menu'
import { NavItem } from '@/types'
import { navItems, profileDropdownItems } from '@/constants/data'
import { useNavigate } from 'react-router-dom'
import { RootState } from '@/lib/store/store'
import { useSelector } from 'react-redux'


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
  const user = useSelector((state: RootState) => state.auth.user);

  // Flatten all nav items (including nested) and profile dropdown items
  const flattenNavItems = (items: NavItem[]): { url: string, shortcut: string[], permission: string }[] => {
    return items.reduce<{ url: string, shortcut: string[], permission: string }[]>((acc, item) => {
      if (item.items && item.items.length > 0) {
        return [...acc, ...flattenNavItems(item.items)]
      }
      if (item.shortcut && item.url) {
        acc.push({ url: item.url, shortcut: item.shortcut, permission: item.permission })
      }
      return acc
    }, [])
  }

  const flattenProfileItems = profileDropdownItems
    .filter(item => item.shortcut && item.to && item.permission)
    .map(item => ({
      url: item.to,
      shortcut: item.shortcut,
      permission:item.permission
    }))

  const allShortcutItems = [
    ...flattenNavItems(navItems),
    ...flattenProfileItems
  ]

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

      // Global shortcuts (double key press) and check permissions
      if (!e.ctrlKey && !e.metaKey && !e.altKey && !e.shiftKey) {
        const matchingItem = allShortcutItems.find(
          item =>
            item.shortcut.length === 2 &&
            item.shortcut[0] === e.key.toLowerCase() &&
            (item.permission ? user?.permissions.includes(item.permission) : true)
        )

        if (matchingItem) {
          e.preventDefault()
          navigate(matchingItem.url)
        }
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [navigate, allShortcutItems, user?.permissions])

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
