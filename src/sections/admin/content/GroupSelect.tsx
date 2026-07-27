import { useState, useMemo, useCallback } from 'react';
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
  Typography
} from '@mui/material';
import { Add, ArrowDown2, People, SearchNormal1 } from 'iconsax-reactjs';
import { useSnackbar } from 'notistack';

import { useCreateGroup, useGroups } from '@/hooks/useGroups';
import type { Group } from '@/types';

interface GroupSelectProps {
  label?: string;
  value: string[]; // selected Group IDs
  onChange: (selectedIds: string[]) => void;
  error?: boolean;
  helperText?: string;
  pageSize?: number;
}

const DEFAULT_PAGE_SIZE = 10;

export default function GroupSelect({
  label = 'Target Learning Groups',
  value,
  onChange,
  error,
  helperText,
  pageSize = DEFAULT_PAGE_SIZE
}: GroupSelectProps) {
  const { enqueueSnackbar } = useSnackbar();
  const { data: groupsData, isLoading } = useGroups();
  const createGroup = useCreateGroup();

  const [visibleCount, setVisibleCount] = useState(pageSize);
  const [inputValue, setInputValue] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const groups: Group[] = useMemo(() => {
    return Array.isArray(groupsData) ? groupsData : [];
  }, [groupsData]);

  // Selected groups mapped by ID
  const selectedOptions = useMemo(() => {
    return groups.filter((g) => value.includes(g.id));
  }, [groups, value]);

  // Filtered groups based on search input
  const filteredGroups = useMemo(() => {
    if (!inputValue.trim()) return groups;
    const search = inputValue.toLowerCase().trim();
    return groups.filter((g) => g.title.toLowerCase().includes(search));
  }, [groups, inputValue]);

  const hasMore = visibleCount < filteredGroups.length;

  const loadMore = useCallback(() => {
    setVisibleCount((prev) => Math.min(prev + pageSize, filteredGroups.length));
  }, [filteredGroups.length, pageSize]);

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
      const newGroup = await createGroup.mutateAsync({
        title: cleanTitle,
        description: ''
      });

      enqueueSnackbar(`Created new learning group: "${cleanTitle}"`, {
        variant: 'success'
      });

      // Auto select the new group ID
      onChange([...value, newGroup.id]);
      setInputValue('');
    } catch (err) {
      enqueueSnackbar((err as Error).message || 'Failed to create group', { variant: 'error' });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Stack spacing={1}>
      <Autocomplete
        multiple
        disableCloseOnSelect
        options={groups}
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
            .filter((item): item is Group => 'id' in item)
            .map((item) => item.id);
          onChange(ids);
        }}
        filterOptions={(options, params) => {
          const searchFiltered = options.filter((opt) =>
            opt.title.toLowerCase().includes(params.inputValue.toLowerCase().trim())
          );
          const sliced = searchFiltered.slice(0, visibleCount);

          const result: (Group | { isCreate: boolean; title: string })[] = [...sliced];

          // Check if user input matches existing group title exactly
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
                  Create group &quot;{option.title}&quot;
                </Typography>
              </Box>
            );
          }

          return (
            <Box component="li" key={key} {...optionProps}>
              <Checkbox size="small" checked={selected} sx={{ mr: 1, p: 0 }} />
              <People size={16} style={{ marginRight: 8, color: '#64748B' }} />
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
                icon={<People size={14} />}
                label={option.title}
                {...tagProps}
                color="info"
              />
            );
          })
        }
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            placeholder="Select or create learning groups..."
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
                  Load {Math.min(pageSize, filteredGroups.length - visibleCount)} more ({filteredGroups.length - visibleCount} remaining)
                </Button>
              </Box>
            )}
          </Paper>
        )}
      />
    </Stack>
  );
}
