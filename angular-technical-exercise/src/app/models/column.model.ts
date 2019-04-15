import { CountryModel } from './country.model';

export class ColumnModel {
  columnDef: string;
  header: string;
  cell: (country: CountryModel) => string;
}
