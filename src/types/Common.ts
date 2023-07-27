interface TableColumn {
  name: string;
  required?: boolean;
  label: string;
  field: string;
  align: 'left';
  sortable?: boolean;
}

export type { TableColumn };
