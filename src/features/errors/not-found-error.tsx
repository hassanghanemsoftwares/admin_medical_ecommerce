import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function NotFoundError() {
  const navigate = useNavigate()
  const { t } = useTranslation()

  return (
    <div className='h-svh'>
      <div className='m-auto flex h-full w-full flex-col items-center justify-center gap-2'>
        <h1 className='text-[7rem] font-bold leading-tight'>404</h1>
        <span className='font-medium'>{t('Errors.404.title')}</span>
        <p className='text-center text-muted-foreground'>
          {t('Errors.404.description')}
        </p>
        <div className='mt-6 flex gap-4'>
          <Button variant='outline' onClick={() => navigate(-1)}>
            {t('Errors.actions.goBack')}
          </Button>
          <Button onClick={() => navigate('/')}>
            {t('Errors.actions.backToHome')}
          </Button>
        </div>
      </div>
    </div>
  )
}
