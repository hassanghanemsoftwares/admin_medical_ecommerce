import { IconSearch } from '@tabler/icons-react';
import { cn } from '@/lib/utils';
import { useSearch } from '@/context/search-context';
import { Button } from './ui/button';
import { useTranslation } from 'react-i18next';

interface Props {
  className?: string;
  type?: React.HTMLInputTypeAttribute;
  placeholder?: string;
}

export function Search({ className = '' }: Props) {
  const { t: messages, i18n } = useTranslation();
  const { setOpen } = useSearch();
  const dir = i18n.dir(); // returns 'ltr' or 'rtl'

  return (
    <Button
      variant='outline'
      className={cn(
        'relative h-8 w-full flex-1 justify-start rounded-md bg-muted/25 text-sm font-normal text-muted-foreground shadow-none hover:bg-muted/50 sm:pr-12 md:w-40 md:flex-none lg:w-56 xl:w-64',
        className
      )}
      onClick={() => setOpen(true)}
    >
      <IconSearch
        aria-hidden='true'
        className={cn(
          'absolute top-1/2 -translate-y-1/2',
          dir === 'rtl' ? 'right-1.5' : 'left-1.5'
        )}
      />
      <span className={cn(dir === 'rtl' ? 'mr-3' : 'ml-3')}>
        {messages('Sidebar.Search')}
      </span>
      <kbd
        className={cn(
          'pointer-events-none absolute hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex',
          dir === 'rtl' ? 'left-[0.3rem]' : 'right-[0.3rem]',
          'top-[0.3rem]'
        )}
      >
        <span className='text-xs'>⌘</span>K
      </kbd>
    </Button>
  );
}
