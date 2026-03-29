import { MenuItem } from 'primeng/api';

export const TRANSACTION_MENU_ITEMS: MenuItem[] = [
  {
    label: 'Options',
    items: [
      { label: 'Editar', icon: 'pi pi-pen-to-square' },
      { label: 'Excluir', icon: 'pi pi-trash' }
    ]
  }
];