import { AddCountryDialogComponent } from './../dialogs/add-country-dialog/add-country-dialog.component';
import { AddColumnDialogComponent } from '../dialogs/add-column-dialog/add-column-dialog.component';
import { ApplicationConstants } from './../../constants/application-constants';
import { ColumnModel } from './../../models/column.model';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subscription, SubscriptionLike } from 'rxjs';
import { TableService } from '../../services/table.service';
import { CountryModel } from '../../models/country.model';
import { MatDialog, MatDialogConfig, MatSort, MatTableDataSource } from '@angular/material';


@Component({
  templateUrl: 'home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
    private _tableDataSubscription: SubscriptionLike;
    currentUserSubscription: Subscription;
    dataSource = new MatTableDataSource();
    columns: ColumnModel[] = [];
    displayedColumns: string[];
    additionalColumnNames: string[];
    @ViewChild(MatSort) sort: MatSort;

    constructor(
      private _tableService: TableService,
      private _addColumnDialog: MatDialog,
      private _addCountryDialog: MatDialog
    ) { }

    ngOnInit() {
      this._tableDataSubscription = this._tableService.getCountryDataObservable().subscribe(
        (countries: CountryModel[]) => {
          this.columns = this.getTableColumns(countries);

          this.displayedColumns = this.columns.map(column => column.columnDef);
          this.displayedColumns.push('actions');

          this.dataSource = new MatTableDataSource(countries);
          this.dataSource.sort = this.sort;
        },
        (error) => {
          console.error(error);
        }
      );

      this._tableService.loadCountryData();
    }

    ngOnDestroy() {
      if (this._tableDataSubscription) {
        this._tableDataSubscription.unsubscribe();
      }
    }

    openColumnDialog(): void {
      const columnDialogRef = this._addColumnDialog.open(AddColumnDialogComponent);
    }

    openCountryDialog(isEdited: boolean, countryInfo: CountryModel): void {
      const countryDialogRef = this._addCountryDialog.open(AddCountryDialogComponent, {
        data: {
          isEdited,
          countryInfo: countryInfo != null ? countryInfo : new CountryModel(),
          additionalColumns: this.additionalColumnNames
        }
      });
    }

    deleteCountry(countryCode: string): void {
      this._tableService.deleteCountry(countryCode);
    }

    private getTableColumns(countries: CountryModel[]): ColumnModel[] {
      let columns: ColumnModel[] = ApplicationConstants.DefaultColumnDefinition;

      const countryAdditionalData = countries.map(country => country.additionalData);

      this.additionalColumnNames = Object.keys(Object.assign({}, ...countryAdditionalData));

      if (this.additionalColumnNames && this.additionalColumnNames.length > 0) {
        this.additionalColumnNames.forEach((additionalColumnKey: string) => {
          if(!(columns.some(displayedColumn => displayedColumn.columnDef === additionalColumnKey))) {

            const newColumn: ColumnModel = {
              columnDef: additionalColumnKey,
              header: additionalColumnKey,
              cell: (country: CountryModel) => `${country.additionalData[additionalColumnKey]}`
            }

            columns.push(newColumn);
          }
        });
      }

      return columns;
    }
}
