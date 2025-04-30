import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'

interface GeneralErrorProps extends React.HTMLAttributes<HTMLDivElement> {
  minimal?: boolean
}

export default function GeneralError({
  className,
  minimal = false,
}: GeneralErrorProps) {
  const navigate = useNavigate()
  const { t } = useTranslation()

  return (
    <div className={cn('h-svh w-full', className)}>
      <div className='m-auto flex h-full w-full flex-col items-center justify-center gap-2'>
        {!minimal && (
          <h1 className='text-[7rem] font-bold leading-tight'>500</h1>
        )}
        <span className='font-medium'>{t('Errors.500.title')}</span>
        <p className='text-center text-muted-foreground'>
          {t('Errors.500.description')}
        </p>
        {!minimal && (
          <div className='mt-6 flex gap-4'>
            <Button variant='outline' onClick={() => navigate(-1)}>
              {t('Errors.actions.goBack')}
            </Button>
            <Button onClick={() => navigate('/')}>
              {t('Errors.actions.backToHome')}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
