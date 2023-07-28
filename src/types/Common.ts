interface TableColumn {
  name: string;
  required?: boolean;
  label: string;
  field: string;
  align?: 'left' | 'right' | 'center';
  sortable?: boolean;
}

export type { TableColumn };
