import { ColumnModel } from '../models/column.model';
import { CountryModel } from '../models/country.model';

export class ApplicationConstants {
  public static readonly PasswordValidationRegex = '^(?=.*[A-Z])(?=.*[0-9])(?=.*\\W)([a-zA-Z0-9_\\W]+)$';
  public static readonly EmailValidationRegex = `^[a-zA-Z._]+@[a-zA-Z_]+?\\.[a-zA-Z]{2,}$`;
  public static readonly TimeoutDuration = 1000 * 60 * 5;
}
