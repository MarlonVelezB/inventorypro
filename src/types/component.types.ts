import * as LucideIcons from 'lucide-react';

// Crear un tipo con todas las claves válidas de lucide-react
export type IconName = keyof typeof LucideIcons;
export interface IconProps {
    name: IconName;
    size?: number;
    color?: string;
    className?: string;
    strokeWidth?: number;
    [key: string]: any; // Allow additional props
}

export interface PageInfo {
  icon: IconName;
  title: string;
  description: string;
}

export interface InputProps {
  label?: string;
  id?: string;
  placeholder?: string;
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  size?: 'small' | 'middle' | 'large';
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  disabled?: boolean;
  readOnly?: boolean;
  className?: string;
  [key: string]: any; // Allow additional props
}

export type SidebarMenuWithOptionalIcon = Omit<SidebarMenuProps, "icon"> & Partial<Pick<SidebarMenuProps, "icon">>;
export interface SidebarMenuProps {
  path: string;
  name: string;
  icon: IconName;
  type: "link" | "dropdown";
  children?: SidebarMenuWithOptionalIcon[];
}