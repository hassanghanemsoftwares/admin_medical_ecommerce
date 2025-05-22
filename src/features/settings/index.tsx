import { Suspense, lazy } from 'react';
import { Main } from '@/components/layout/main';
import ConfigurationView from './configurations/components/form/ConfigurationView';
import Spinner from '@/components/spinner';

// Lazy load table components
const BrandsTable = lazy(() => import('./brands/components/table/BrandsTable'));
const ColorSeasonsTable = lazy(() => import('./color-seasons/components/table/ColorSeasonsTable'));
const ColorsTable = lazy(() => import('./color/components/table/ColorsTable'));
const SizesTable = lazy(() => import('./sizes/components/table/SizesTable'));
const TagsTable = lazy(() => import('./tags/components/table/TagsTable'));
const WarehousesTable = lazy(() => import('./warehouses/components/table/WarehousesTable'));
const ShelvesTable = lazy(() => import('./shelves/components/table/ShelvesTable'));
const OccupationsTable = lazy(() => import('./occupations/components/table/OccupationsTable'));

// Centered fallback
const CenteredSpinner = () => (
  <div className="flex items-center justify-center h-40 w-full">
    <Spinner />
  </div>
);

export default function Settings() {
  return (
    <Main>
      <div className="w-full">
        <ConfigurationView />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Suspense fallback={<CenteredSpinner />}><BrandsTable /></Suspense>
        <Suspense fallback={<CenteredSpinner />}><ColorSeasonsTable /></Suspense>
        <Suspense fallback={<CenteredSpinner />}><ColorsTable /></Suspense>
        <Suspense fallback={<CenteredSpinner />}><SizesTable /></Suspense>
        <Suspense fallback={<CenteredSpinner />}><TagsTable /></Suspense>
        <Suspense fallback={<CenteredSpinner />}><WarehousesTable /></Suspense>
        <Suspense fallback={<CenteredSpinner />}><ShelvesTable /></Suspense>
        <Suspense fallback={<CenteredSpinner />}><OccupationsTable /></Suspense>
      </div>
    </Main>
  );
}
