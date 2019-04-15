import { Injectable } from '@angular/core';
import { CountryModel } from '../models/country.model';
import { Observable, of, Subject } from 'rxjs';
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

  public saveNewColumn(columnName: string): void {
    if (this._countries && this._countries.length > 0) {
      this._countries.forEach((country) => {
          country.additionalData[columnName] = '';
      });

      localStorage.setItem('tableData', JSON.stringify(this._countries));
      this._countriesSubject.next(this._countries);
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
