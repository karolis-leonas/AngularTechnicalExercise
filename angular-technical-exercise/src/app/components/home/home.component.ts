import { ColumnModel } from './../../models/column.model';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subscription, SubscriptionLike } from 'rxjs';
import { TableService } from '../../services/table.service';
import { CountryModel } from '../../models/country.model';
import { AddColumnDialogComponent } from '../dialogs/add-column-dialog/add-column-dialog.component';
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
    @ViewChild(MatSort) sort: MatSort;

    constructor(
      private _tableService: TableService,
      private _addColumnDialog: MatDialog
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

    openDialog(): void {
      const dialogRef = this._addColumnDialog.open(AddColumnDialogComponent, {
        width: '250px'
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
      });
    }

    private getTableColumns(countries: CountryModel[]): ColumnModel[] {
      let columns = [
        { columnDef: 'name', header: 'Name',    cell: (country: CountryModel) => `${country.name}` },
        { columnDef: 'countryCode',     header: 'Country code',   cell: (country: CountryModel) => `${country.countryCode}`     },
        { columnDef: 'phoneCode',   header: 'Phone code', cell: (country: CountryModel) => `${country.phoneCode}`   }
      ];

      const countryAdditionalData = countries.map(country => country.additionalData);

      const additionalColumnKeys = Object.keys(Object.assign({}, ...countryAdditionalData));

      if (additionalColumnKeys && additionalColumnKeys.length > 0) {
        additionalColumnKeys.forEach((additionalColumnKey: string) => {
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
