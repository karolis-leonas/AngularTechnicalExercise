import { CountryDialogData } from './../../../models/country-dialog-data.model';
import { TableService } from './../../../services/table.service';
import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, Validators, AbstractControl, FormBuilder, FormControl, FormArray } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-column-delete-confirmation',
  templateUrl: './column-delete-confirmation.component.html',
  styleUrls: ['./column-delete-confirmation.component.css']
})

export class ColumnDeleteConfirmationComponent implements OnInit {
  errorMessage: string = null;

  constructor(
    public dialogRef: MatDialogRef<ColumnDeleteConfirmationComponent>,
    private _tableService: TableService,
    @Inject(MAT_DIALOG_DATA) public columnName: string) {}

  ngOnInit() {
  }

  closeModal(): void {
      this.dialogRef.close();
  }

  onSubmit(): void {
    this.errorMessage = null;

    if (this.columnName) {
      this._tableService.deleteColumn(this.columnName).subscribe(
        (result) => {
          console.log(`Deleted column: ${result}`);
          this.dialogRef.close();
        },
        (error) => {
          this.errorMessage = error;
        });
    }
  }
}
