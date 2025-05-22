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
      permission: item.permission
    }))

  const allShortcutItems = [
    ...flattenNavItems(navItems),
    ...flattenProfileItems
  ]

  React.useEffect(() => {
    let keySequence: string[] = []
    let ctrlOrMetaPressed = false
    let timeout: NodeJS.Timeout | null = null

    const reset = () => {
      keySequence = []
      ctrlOrMetaPressed = false
      if (timeout) clearTimeout(timeout)
      timeout = null
    }

    const down = (e: KeyboardEvent) => {
      if (document.activeElement instanceof HTMLInputElement) return

      // Detect Ctrl or Meta key press
      if (e.key === 'Control' || e.key === 'Meta') {
        ctrlOrMetaPressed = true
        return
      }

      // Open CommandMenu on Ctrl+K
      if (e.key === 'k' && ctrlOrMetaPressed) {
        e.preventDefault()
        setOpen((open) => !open)
        reset()
        return
      }

      // If Ctrl/Meta is pressed and a letter is typed
      if (ctrlOrMetaPressed) {
        const key = e.key.toLowerCase()

        keySequence.push(key)

        // Keep max 2 keys in the sequence
        if (keySequence.length > 2) {
          keySequence.shift()
        }

        const matchingItem = allShortcutItems.find(
          item =>
            item.shortcut[0] === keySequence[0] &&
            item.shortcut[1] === keySequence[1] &&
            (item.permission ? user?.permissions.includes(item.permission) : true)
        )

        if (matchingItem) {
          e.preventDefault()
          navigate(matchingItem.url)
          reset()
          return
        }

        // Set/reset timeout to clear sequence after 1 second
        if (timeout) clearTimeout(timeout)
        timeout = setTimeout(reset, 1000)
      }
    }

    const up = (e: KeyboardEvent) => {
      if (e.key === 'Control' || e.key === 'Meta') {
        ctrlOrMetaPressed = false
        keySequence = []
      }
    }

    document.addEventListener('keydown', down)
    document.addEventListener('keyup', up)

    return () => {
      document.removeEventListener('keydown', down)
      document.removeEventListener('keyup', up)
      if (timeout) clearTimeout(timeout)
    }
  }, [navigate, allShortcutItems, user?.permissions])


  return (
    <SearchContext.Provider value={{ open, setOpen }}>
      {children}
      <CommandMenu />
    </SearchContext.Provider>
  )
}

export const useSearch = () => {
  const searchContext = React.useContext(SearchContext)

  if (!searchContext) {
    throw new Error('useSearch has to be used within <SearchContext.Provider>')
  }

  return searchContext
}
