import { Injectable } from '@angular/core';
import { CountryModel } from '../models/country.model';
import { Observable, of, Subject, throwError } from 'rxjs';
import { map, share } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TableService {
  private _countries: CountryModel[] = [];
  private _countriesSubject = new Subject<CountryModel[]>();
  private _visibleTableColumns: string[] = [];

  constructor(private _httpClient: HttpClient) { }

  public getCountryDataObservable(): Observable<CountryModel[]> {
    return this._countriesSubject.asObservable();
  }


  loadCountryData(): void {
    if (localStorage.getItem('tableData') != null) {
      const unmappedStorageData = JSON.parse(localStorage.getItem('tableData'));
      this._countries = this.mapCountryData(unmappedStorageData);

      this._countriesSubject.next(this._countries);
    } else {
      this.loadInitialCountryData().subscribe(
        (mappedCountries) => {
          this._countries = mappedCountries;

          this._countriesSubject.next(this._countries);
        },
        (error) => {
          console.error(error);
        }
      );
    }
  }

  public saveNewColumn(columnName: string): Observable<string> {
    if (this._countries && this._countries.length > 0) {
      if (this._countries.some(country => (country.hasOwnProperty(columnName) || country.additionalData.hasOwnProperty(columnName)))) {
        return throwError('Column with this name already exists.');
      } else {
        this._countries.forEach((country) => {
          country.additionalData[columnName] = '';
        });
      }

      localStorage.setItem('tableData', JSON.stringify(this._countries));
      this._countriesSubject.next(this._countries);

      return of(columnName);
    } else {
      return throwError('Unexpected error when saving column data.');
    }
  }

  public createNewCountry(newCountry: any): Observable<CountryModel> {
    if (this._countries && this._countries.length > 0) {
      return this.addCountry(newCountry);
    } else {
      return throwError('Unexpected error when saving country data.');
    }
  }

  public updateExistingCountry(newCountry: any, oldCountryCode: string): Observable<CountryModel> {
    if (this._countries && this._countries.length > 0) {
      this._countries = this._countries.filter(country => country.countryCode !== oldCountryCode);

      return this.addCountry(newCountry);
    } else {
      return throwError('Unexpected error when saving country data.');
    }
  }

  private addCountry(newCountry: any): Observable<CountryModel> {
    if (this._countries.find(country => country.name === newCountry.name)) {
      return throwError('Country with such name already exists');
    } else if (this._countries.find(country => country.countryCode === newCountry.countryCode)) {
      return throwError('Country with such country code already exists');
    } else {
      const countryToBeAdded: CountryModel = {
        name: newCountry.name,
        countryCode: newCountry.countryCode,
        phoneCode: newCountry.phoneCode,
        additionalData: newCountry.additionalData != null ? newCountry.additionalData : {}
      }

      this._countries.push(countryToBeAdded);
      localStorage.setItem('tableData', JSON.stringify(this._countries));
      this._countriesSubject.next(this._countries);
      return of(countryToBeAdded);
    }
  }

  private loadInitialCountryData(): Observable<CountryModel[]> {
    return this._httpClient.get('../../assets/countryInitialData.json').pipe(
      map((unmappedItems: any) => {
        const mappedCountries = this.mapCountryData(unmappedItems);
        localStorage.setItem('tableData', JSON.stringify(mappedCountries));

        return mappedCountries;
      })
    );
  }

  public deleteCountry(oldCountryCode: string): void {
    this._countries = this._countries.filter(country => country.countryCode !== oldCountryCode);
    localStorage.setItem('tableData', JSON.stringify(this._countries));
    this._countriesSubject.next(this._countries);
  }

  public deleteColumn(deletedColumnName: string): Observable<string> {
    if (this._countries && this._countries.length > 0) {
      this._countries.forEach((country) => {
        if (country.additionalData && country.additionalData[deletedColumnName] !== undefined) {
          delete country.additionalData[deletedColumnName];
        }
      });

      localStorage.setItem('tableData', JSON.stringify(this._countries));
      this._countriesSubject.next(this._countries);
      return of(deletedColumnName);
    } else {
      return throwError('Unexpected error when deleting column data.');
    }
  }

  private mapCountryData(unmappedItems: any): Array<CountryModel> {
    const mappedCountries: CountryModel[] = [];

    unmappedItems.forEach(phoneCodeItem => {
      const mappedCountry: CountryModel = {
        name: phoneCodeItem.name,
        countryCode: phoneCodeItem.countryCode,
        phoneCode: phoneCodeItem.phoneCode,
        additionalData: phoneCodeItem.additionalData != null ? phoneCodeItem.additionalData : {}
      }

      mappedCountries.push(mappedCountry);
    });

    return mappedCountries;
  }
}
