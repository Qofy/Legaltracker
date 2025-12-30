import { h } from 'vue';

const Table = {
  name: 'UiTable',
  setup(_, { slots }) {
    return () => h('div', { class: 'ui-table overflow-auto w-full' }, slots.default ? slots.default() : []);
  },
};

const TableHeader = {
  name: 'UiTableHeader',
  setup(_, { slots }) {
    return () => h('div', { class: 'ui-table-header text-sm text-gray-600' }, slots.default ? slots.default() : []);
  },
};

const TableBody = {
  name: 'UiTableBody',
  setup(_, { slots }) {
    return () => h('div', { class: 'ui-table-body divide-y' }, slots.default ? slots.default() : []);
  },
};

const TableRow = {
  name: 'UiTableRow',
  props: { as: { type: String, default: 'div' } },
  setup(props, { slots }) {
    return () => h(props.as, { class: 'ui-table-row py-2' }, slots.default ? slots.default() : []);
  },
};

const TableHead = {
  name: 'UiTableHead',
  setup(_, { slots }) {
    return () => h('div', { class: 'ui-table-head font-medium text-sm' }, slots.default ? slots.default() : []);
  },
};

const TableCell = {
  name: 'UiTableCell',
  props: { as: { type: String, default: 'div' } },
  setup(props, { slots }) {
    return () => h(props.as, { class: 'ui-table-cell px-2 py-1' }, slots.default ? slots.default() : []);
  },
};

export { Table, TableBody, TableCell, TableHead, TableHeader, TableRow };
export default { Table, TableBody, TableCell, TableHead, TableHeader, TableRow };
