
import { Main } from '@/components/layout/main'
import { useTranslation } from 'react-i18next';

export default function Dashboard() {
  const { t } = useTranslation();
  return (

    <Main>
      <div className='mb-2 flex items-center justify-between space-y-2'>
      <h1>{t('HomePage.title')}</h1>
        <h1 className='text-2xl font-bold tracking-tight'>Dashboard</h1>
      </div>
    </Main>

  )
}
