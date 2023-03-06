export interface State {
  menu: MenuItem[] | [];
  userMenuRights: MenuItem[] | [];
  onModule: Modules | '';
}

export type MenuTypes =
  | 'MD'
  | 'D'
  | 'W'
  | 'MP'
  | 'MW'
  | 'MR'
  | 'PW'
  | 'P'
  | 'MG'
  | 'PD';

export type Modules =
  | 'MNT'
  | 'SET'
  | 'LOS'
  | 'LMS'
  | 'DEP'
  | 'ACT'
  | 'COL'
  | 'MOB'
  | 'HR';

export interface MenuItem {
  addRight: boolean | null;
  code: string;
  deleteRight: boolean | null;
  description: string | null;
  editRight: boolean | null;
  export: unknown | null;
  hotKey: string | null;
  itemOrder: number;
  login: unknown | null;
  menuType: MenuTypes;
  mobile: boolean | null;
  modules: string | null;
  name: string;
  parentCode: string;
  parentUrl: string | null;
  roleType: string | null;
  url: string | null;
  viewRight: boolean | null;
}
