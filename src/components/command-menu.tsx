import React from 'react';
import { IconMoon, IconSun } from '@tabler/icons-react';
import { useSearch } from '@/context/search-context';
import { useTheme } from '@/context/theme-context';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { useNavigate } from 'react-router-dom';
import { navItems, profileDropdownItems } from '@/constants/data';
import { useTranslation } from 'react-i18next';
import { ScrollArea } from './ui/scroll-area';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store/store';

export function CommandMenu() {
  const { t: messages, i18n } = useTranslation();
  const navigate = useNavigate();
  const { setTheme } = useTheme();
  const { open, setOpen } = useSearch();
  const user = useSelector((state: RootState) => state.auth.user);
  const dir = i18n.dir();

  const runCommand = React.useCallback(
    (command: () => unknown) => {
      setOpen(false);
      command();
    },
    [setOpen]
  );

  const navGroups = [
    {
      title: 'Overview',
      items: navItems.filter((item) => {
        if (item.permission && !user?.permissions.includes(item.permission)) return false;

        if (item.items?.length) {
          item.items = item.items.filter((subItem) =>
            subItem.permission ? user?.permissions.includes(subItem.permission) : true
          );

          return item.items.length > 0;
        }

        return true;
      }),
    },
  ];
  const profileGroup = {
    title: 'Profile',
    items: profileDropdownItems.filter((item) => user?.permissions.includes(item.permission)),
  };
  return (
    <CommandDialog modal open={open} onOpenChange={setOpen}>
      <div dir={dir}>
        <CommandInput placeholder={messages('Sidebar.type_a_command_or_search')} />
        <CommandList>
          <ScrollArea>
            <CommandEmpty>{messages('Sidebar.no_results_found')}</CommandEmpty>

            {navGroups.map((group) => (
              <CommandGroup
                key={group.title}
                heading={<span className={dir === 'rtl' ? 'text-right w-full block' : ''}>
                  {messages('Sidebar.' + group.title)}
                </span>}
              >
                {group.items.map((navItem, i) => {
                  if (navItem.url && navItem.url !== '#') {
                    return (
                      <CommandItem
                        key={`${navItem.url}-${i}`}
                        value={navItem.title}
                        onSelect={() => runCommand(() => navigate(navItem.url))}
                        className="place-content-between"
                      >
                        {messages('Sidebar.' + navItem.title)}
                        {navItem.shortcut?.length && (
                          <div className="relative z-10 grid grid-flow-col gap-1">
                            {navItem.shortcut.map((sc, i) => (
                              <kbd
                                key={sc + i}
                                className="flex items-center gap-1 rounded-md border px-1.5 py-1 text-xs font-medium shadow"
                              >
                                {sc}
                              </kbd>
                            ))}
                          </div>
                        )}
                      </CommandItem>
                    );
                  }

                  return navItem.items?.map((subItem, j) => (
                    <CommandItem
                      key={`${subItem.url}-${j}`}
                      value={subItem.title}
                      onSelect={() => runCommand(() => navigate(subItem.url))}
                      className="place-content-between"
                    >
                      {messages('Sidebar.' + subItem.title)}
                      {subItem.shortcut?.length && (
                        <div className="relative z-10 grid grid-flow-col gap-1">
                          {subItem.shortcut.map((sc, i) => (
                            <kbd
                              key={sc + i}
                              className="flex items-center gap-1 rounded-md border px-1.5 py-1 text-xs font-medium shadow"
                            >
                              {sc}
                            </kbd>
                          ))}
                        </div>
                      )}
                    </CommandItem>
                  ));
                })}
              </CommandGroup>
            ))}
            <CommandSeparator />
            <CommandGroup
              heading={<span className={dir === 'rtl' ? 'text-right w-full block' : ''}>
                {messages('Sidebar.Profile')}
              </span>}
            >
              {profileGroup.items.map((profileItem, i) => (
                <CommandItem
                  key={`${profileItem.to}-${i}`}
                  value={profileItem.translationKey}
                  onSelect={() => runCommand(() => navigate(profileItem.to))}
                  className="place-content-between"
                >
                  {messages(profileItem.translationKey)}
                  {profileItem.shortcut?.length && (
                    <div className="relative z-10 grid grid-flow-col gap-1">
                      {profileItem.shortcut.map((sc, i) => (
                        <kbd
                          key={sc + i}
                          className="flex items-center gap-1 rounded-md border px-1.5 py-1 text-xs font-medium shadow"
                        >
                          {sc}
                        </kbd>
                      ))}
                    </div>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>

            {/* Theme toggle */}
            <CommandSeparator />
            <CommandGroup
              heading={<span className={dir === 'rtl' ? 'text-right w-full block' : ''}>
                {messages('Sidebar.togle_theme')}
              </span>}
            >
              <CommandItem
                className="place-content-between"
                onSelect={() => runCommand(() => setTheme('light'))}
              >
                <IconSun />
                <span>{messages('Sidebar.set_light_theme')}</span>
              </CommandItem>
              <CommandItem
                className="place-content-between"
                onSelect={() => runCommand(() => setTheme('dark'))}
              >
                <IconMoon className="scale-90" />
                <span>{messages('Sidebar.set_dark_theme')}</span>
              </CommandItem>
            </CommandGroup>
          </ScrollArea>
        </CommandList>
      </div>
    </CommandDialog>
  );
}