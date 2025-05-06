import { Main } from '@/components/layout/main';
import { BrandsTable } from './brands/components/table/BrandsTable';
import { RootState } from '@/lib/store/store';
import { useSelector } from 'react-redux';
import { ColorSeasonsTable } from './color-seasons/components/table/ColorSeasonsTable';
import { ColorsTable } from './color/components/table/ColorsTable';
import { SizesTable } from './sizes/components/table/SizesTable';
import { TagsTable } from './tags/components/table/TagsTable';
import { WarehousesTable } from './warehouses/components/table/WarehousesTable';
import { ShelvesTable } from './shelves/components/table/ShelvesTable';
import ConfigurationView from './configurations/components/form/ConfigurationView';

export default function Settings() {
  const user = useSelector((state: RootState) => state.auth.user);
  const hasPermission = (permission: string) => user?.permissions?.includes(permission);
  const canViewBrand = hasPermission('view-brand');
  const canViewColorSeason = hasPermission('view-color-season');
  const canViewColor = hasPermission('view-color');
  const canViewSize = hasPermission('view-size');
  const canViewTag = hasPermission('view-tag');
  const canViewWarehouse = hasPermission('view-warehouse');
  const canViewShelf = hasPermission('view-shelf');
  const canViewConfiguration= hasPermission('view-configuration');

  
  return (
    <Main>
         {canViewConfiguration && (
          <div className="w-full">
            <ConfigurationView />
          </div>
        )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {canViewBrand && (
          <div className="w-full">
            <BrandsTable />
          </div>
        )}
        {canViewColorSeason && (
          <div className="w-full">
            <ColorSeasonsTable />
          </div>
        )}
        {canViewColor && (
          <div className="w-full">
            <ColorsTable />
          </div>
        )}
        {canViewSize && (
          <div className="w-full">
            <SizesTable />
          </div>
        )}
        {canViewTag && (
          <div className="w-full">
            <TagsTable />
          </div>
        )}
        {canViewWarehouse && (
          <div className="w-full">
            <WarehousesTable />
          </div>
        )}
        {canViewShelf && (
          <div className="w-full">
            <ShelvesTable />
          </div>
        )}     
      </div>
   
    </Main>
  );
}
