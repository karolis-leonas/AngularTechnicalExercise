import { CountryModel } from './country.model';

export class CountryDialogData {
  isEdited: boolean = false;
  countryInfo: CountryModel = new CountryModel();
  additionalColumns: string[] = [];
}
