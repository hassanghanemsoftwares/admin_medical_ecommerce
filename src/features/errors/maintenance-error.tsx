import { Button } from '@/components/ui/button'
import { useTranslation } from 'react-i18next'

export default function MaintenanceError() {
  const { t } = useTranslation()

  return (
    <div className='h-svh'>
      <div className='m-auto flex h-full w-full flex-col items-center justify-center gap-2'>
        <h1 className='text-[7rem] font-bold leading-tight'>503</h1>
        <span className='font-medium'>{t('Errors.503.title')}</span>
        <p className='text-center text-muted-foreground'>
          {t('Errors.503.description')}
        </p>
        <div className='mt-6 flex gap-4'>
          <Button variant='outline'>{t('Errors.actions.learnMore')}</Button>
        </div>
      </div>
    </div>
  )
}
