import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { RootState } from '@/lib/store/store'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import SignOut from './SignOut'
import { useTranslation } from 'react-i18next'

export function ProfileDropdown() {
  const { t: messages } = useTranslation()
  const user = useSelector((state: RootState) => state.auth.user)
  const hasPermission = (permission: string) => user?.permissions?.includes(permission)
  const canViewProfile = hasPermission('view-profile')
  const canViewSettings = hasPermission('view-settings')
  const showDropdownGroup = canViewProfile || canViewSettings

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='relative h-8 w-8 rounded-full'>
          <Avatar className="h-8 w-8 rounded-lg">
            <AvatarImage src={user?.image || ''} alt={user?.name || ''} />
            <AvatarFallback className="rounded-lg">
              {user?.name?.slice(0, 2)?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className='w-56' align='end' forceMount>
        <DropdownMenuLabel className='font-normal'>
          <div className='flex flex-col space-y-1'>
            <p className='text-sm font-medium leading-none'>{user?.name}</p>
            <p className='text-xs leading-none text-muted-foreground'>{user?.email}</p>
          </div>
        </DropdownMenuLabel>

        {showDropdownGroup && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {canViewProfile && (
                <DropdownMenuItem asChild>
                  <Link to='/profile'>
                    {messages('Sidebar.Profile')}
                    <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                  </Link>
                </DropdownMenuItem>
              )}
              {canViewSettings && (
                <DropdownMenuItem asChild>
                  <Link to='/settings'>
                    {messages('Sidebar.Settings')}
                    <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                  </Link>
                </DropdownMenuItem>
              )}
            </DropdownMenuGroup>
          </>
        )}

        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <SignOut />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
