import { useState, type SyntheticEvent } from 'react';
import { Box, Tab, Tabs } from '@mui/material';
import { Category, Tag } from 'iconsax-reactjs';

import Breadcrumbs from '@/components/Breadcrumbs';
import TaxonomyPanel from '@/sections/admin/taxonomy/TaxonomyPanel';
import type { TaxonomyKind } from '@/types';

export default function TaxonomyPage() {
  const [tab, setTab] = useState<TaxonomyKind>('categories');
  const handleChange = (_e: SyntheticEvent, value: TaxonomyKind) => setTab(value);

  return (
    <Box>
      <Breadcrumbs title="Taxonomy" />
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2.5 }}>
        <Tabs value={tab} onChange={handleChange} aria-label="taxonomy tabs">
          <Tab icon={<Category size={16} />} iconPosition="start" label="Categories" value="categories" />
          <Tab icon={<Tag size={16} />} iconPosition="start" label="Tags" value="tags" />
        </Tabs>
      </Box>
      {tab === 'categories' ? <TaxonomyPanel kind="categories" /> : <TaxonomyPanel kind="tags" />}
    </Box>
  );
}
