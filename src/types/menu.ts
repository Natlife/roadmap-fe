import type { ComponentType, ReactNode } from 'react';
import type { UserRole } from './auth';

export interface NavItemType {
  id: string;
  title: ReactNode;
  type: 'group' | 'collapse' | 'item';
  url?: string;
  icon?: ComponentType<any>;
  target?: boolean;
  external?: boolean;
  disabled?: boolean;
  chip?: { label: string; color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' };
  breadcrumbs?: boolean;
  caption?: ReactNode;
  children?: NavItemType[];
  /** restrict visibility to these roles; undefined = everyone */
  roles?: UserRole[];
}

export interface MenuItems {
  items: NavItemType[];
}
