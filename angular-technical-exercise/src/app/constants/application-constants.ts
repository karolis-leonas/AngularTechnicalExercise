import { ColumnModel } from '../models/column.model';
import { CountryModel } from '../models/country.model';

export class ApplicationConstants {
  public static PasswordValidationRegex = '^(?=.*[A-Z])(?=.*[0-9])(?=.*\\W)([a-zA-Z0-9_\\W]+)$';
  public static EmailValidationRegex = `^[a-zA-Z._]+@[a-zA-Z_]+?\\.[a-zA-Z]{2,}$`;
  public static TimeoutDuration = 1000 * 60 * 5;
  public static DefaultColumnDefinition: ColumnModel[] = [
    { columnDef: 'name', header: 'Name',    cell: (country: CountryModel) => `${country.name}` },
    { columnDef: 'countryCode',     header: 'Country code',   cell: (country: CountryModel) => `${country.countryCode}`     },
    { columnDef: 'phoneCode',   header: 'Phone code', cell: (country: CountryModel) => `${country.phoneCode}`   }
  ];
}
