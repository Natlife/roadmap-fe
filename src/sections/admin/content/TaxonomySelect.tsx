import { useState, useMemo, useRef, useCallback } from 'react';
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
  createFilterOptions
} from '@mui/material';
import { Add, ArrowDown2, SearchNormal1 } from 'iconsax-reactjs';
import { useSnackbar } from 'notistack';

import { useCreateTaxonomy, useTaxonomyList } from '@/hooks/useTaxonomy';
import type { TaxonomyItem, TaxonomyKind } from '@/types';

interface TaxonomySelectProps {
  kind: TaxonomyKind; // 'categories' | 'tags'
  label: string;
  value: string[]; // selected IDs
  onChange: (selectedIds: string[]) => void;
  error?: boolean;
  helperText?: string;
  pageSize?: number;
}

const DEFAULT_PAGE_SIZE = 10;

const filter = createFilterOptions<TaxonomyItem | { isCreate: boolean; title: string }>();

export default function TaxonomySelect({
  kind,
  label,
  value,
  onChange,
  error,
  helperText,
  pageSize = DEFAULT_PAGE_SIZE
}: TaxonomySelectProps) {
  const { enqueueSnackbar } = useSnackbar();
  const { data: taxonomyData, isLoading } = useTaxonomyList(kind);
  const createTaxonomy = useCreateTaxonomy(kind);

  const [visibleCount, setVisibleCount] = useState(pageSize);
  const [inputValue, setInputValue] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const items: TaxonomyItem[] = useMemo(() => {
    return Array.isArray(taxonomyData) ? taxonomyData : [];
  }, [taxonomyData]);

  // Selected items mapped by ID
  const selectedOptions = useMemo(() => {
    return items.filter((item) => value.includes(item.id));
  }, [items, value]);

  // Filtered items based on input
  const filteredItems = useMemo(() => {
    if (!inputValue.trim()) return items;
    const search = inputValue.toLowerCase().trim();
    return items.filter((item) => item.title.toLowerCase().includes(search));
  }, [items, inputValue]);

  // Paginated subset of items to show
  const paginatedItems = useMemo(() => {
    return filteredItems.slice(0, visibleCount);
  }, [filteredItems, visibleCount]);

  const hasMore = visibleCount < filteredItems.length;

  const loadMore = useCallback(() => {
    setVisibleCount((prev) => Math.min(prev + pageSize, filteredItems.length));
  }, [filteredItems.length, pageSize]);

  // Handle scroll down inside dropdown paper
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    if (target.scrollHeight - target.scrollTop <= target.clientHeight + 40 && hasMore) {
      loadMore();
    }
  };

  const handleQuickCreate = async (titleToCreate: string) => {
    const cleanTitle = titleToCreate.trim();
    if (!cleanTitle || isCreating) return;

    setIsCreating(true);
    try {
      const newItem = await createTaxonomy.mutateAsync({
        title: cleanTitle,
        description: ''
      });

      enqueueSnackbar(`Created new ${kind === 'categories' ? 'category' : 'tag'}: "${cleanTitle}"`, {
        variant: 'success'
      });

      // Auto select the new item
      onChange([...value, newItem.id]);
      setInputValue('');
    } catch (err) {
      enqueueSnackbar((err as Error).message || `Failed to create ${kind}`, { variant: 'error' });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Stack spacing={1}>
      <Autocomplete
        multiple
        disableCloseOnSelect
        options={items}
        value={selectedOptions}
        inputValue={inputValue}
        onInputChange={(_, newInputValue) => {
          setInputValue(newInputValue);
          setVisibleCount(pageSize); // reset pagination on search
        }}
        loading={isLoading}
        getOptionLabel={(option) => (typeof option === 'string' ? option : option.title)}
        isOptionEqualToValue={(option, val) => option.id === val.id}
        onChange={(_, newValue) => {
          const ids = newValue
            .filter((item): item is TaxonomyItem => 'id' in item)
            .map((item) => item.id);
          onChange(ids);
        }}
        filterOptions={(options, params) => {
          // Slice according to visibleCount for pagination
          const searchFiltered = options.filter((opt) =>
            opt.title.toLowerCase().includes(params.inputValue.toLowerCase().trim())
          );
          const sliced = searchFiltered.slice(0, visibleCount);

          const result: (TaxonomyItem | { isCreate: boolean; title: string })[] = [...sliced];

          // Check if user input matches existing item exactly
          const exactExists = options.some(
            (opt) => opt.title.toLowerCase() === params.inputValue.trim().toLowerCase()
          );

          if (params.inputValue.trim() !== '' && !exactExists) {
            result.push({
              isCreate: true,
              title: params.inputValue.trim()
            });
          }

          return result;
        }}
        renderOption={(props, option: any, { selected }) => {
          const { key, ...optionProps } = props;

          if (option.isCreate) {
            return (
              <Box
                key={`create-${option.title}`}
                {...optionProps}
                onClick={(e) => {
                  e.stopPropagation();
                  handleQuickCreate(option.title);
                }}
                sx={{
                  color: 'primary.main',
                  fontWeight: 600,
                  bgcolor: 'action.hover',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  py: 1,
                  px: 2,
                  cursor: 'pointer',
                  borderTop: '1px solid',
                  borderColor: 'divider'
                }}
              >
                <Add size={18} />
                <Typography variant="body2" fontWeight={600}>
                  Create &quot;{option.title}&quot;
                </Typography>
              </Box>
            );
          }

          return (
            <Box component="li" key={key} {...optionProps}>
              <Checkbox size="small" checked={selected} sx={{ mr: 1, p: 0 }} />
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {option.title}
              </Typography>
            </Box>
          );
        }}
        renderTags={(selected, getTagProps) =>
          selected.map((option, index) => {
            const { key, ...tagProps } = getTagProps({ index });
            return (
              <Chip
                key={key}
                variant="combined"
                size="small"
                label={option.title}
                {...tagProps}
                color={kind === 'categories' ? 'primary' : 'secondary'}
              />
            );
          })
        }
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            placeholder={`Select or search ${kind}...`}
            error={error}
            helperText={helperText}
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <>
                  <InputAdornment position="start" sx={{ ml: 1 }}>
                    <SearchNormal1 size={16} />
                  </InputAdornment>
                  {params.InputProps.startAdornment}
                </>
              ),
              endAdornment: (
                <>
                  {isLoading || isCreating ? <CircularProgress color="inherit" size={18} /> : null}
                  {params.InputProps.endAdornment}
                </>
              )
            }}
          />
        )}
        PaperComponent={({ children }) => (
          <Paper
            elevation={8}
            onScroll={handleScroll}
            sx={{
              borderRadius: 2,
              mt: 1,
              maxHeight: 280,
              overflowY: 'auto'
            }}
          >
            {children}

            {hasMore && (
              <Box sx={{ p: 1, textAlign: 'center', borderTop: '1px solid', borderColor: 'divider' }}>
                <Button
                  size="small"
                  fullWidth
                  variant="text"
                  startIcon={<ArrowDown2 size={14} />}
                  onClick={loadMore}
                  sx={{ textTransform: 'none', fontSize: 13, color: 'text.secondary' }}
                >
                  Load {Math.min(pageSize, filteredItems.length - visibleCount)} more ({filteredItems.length - visibleCount} remaining)
                </Button>
              </Box>
            )}
          </Paper>
        )}
      />
    </Stack>
  );
}
