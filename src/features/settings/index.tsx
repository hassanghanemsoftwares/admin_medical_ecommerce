import { Main } from '@/components/layout/main';
import { BrandsTable } from './brands/components/table/BrandsTable';
import { ColorSeasonsTable } from './color-seasons/components/table/ColorSeasonsTable';
import { ColorsTable } from './color/components/table/ColorsTable';
import { SizesTable } from './sizes/components/table/SizesTable';
import { TagsTable } from './tags/components/table/TagsTable';
import { WarehousesTable } from './warehouses/components/table/WarehousesTable';
import { ShelvesTable } from './shelves/components/table/ShelvesTable';
import ConfigurationView from './configurations/components/form/ConfigurationView';
import { OccupationsTable } from './occupations/components/table/OccupationsTable';

export default function Settings() {
  return (
    <Main>
      <div className="w-full">
        <ConfigurationView />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="w-full">
          <BrandsTable />
        </div>
        <div className="w-full">
          <ColorSeasonsTable />
        </div>
        <div className="w-full">
          <ColorsTable />
        </div>
        <div className="w-full">
          <SizesTable />
        </div>
        <div className="w-full">
          <TagsTable />
        </div>
        <div className="w-full">
          <WarehousesTable />
        </div>
        <div className="w-full">
          <ShelvesTable />
        </div>
        <div className="w-full">
          <OccupationsTable />
        </div>
      </div>
    </Main>
  );
}
