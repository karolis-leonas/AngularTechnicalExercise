import { TableService } from './../../../services/table.service';
import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, Validators, AbstractControl, FormBuilder } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-add-column-dialog',
  templateUrl: './add-column-dialog.component.html',
  styleUrls: ['./add-column-dialog.component.css']
})

export class AddColumnDialogComponent implements OnInit {
  columnForm: FormGroup;

  loading = false;
  submitted = false;
  errorMessage: string = null;

  constructor(
    public dialogRef: MatDialogRef<AddColumnDialogComponent>,
    private _formBuilder: FormBuilder,
    private _tableService: TableService) {}

    ngOnInit() {
      this.columnForm = this._formBuilder.group({
          columnName: ['', Validators.compose([Validators.required])
        ]
      });
    }

  get columnName(): AbstractControl {
    return this.columnForm.get('columnName');
  }

  closeModal() {
      this.dialogRef.close();
  }

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = null;

    if (this.columnForm.invalid) {
        return;
    }
    this.loading = true;
    this._tableService.saveNewColumn(this.columnName.value).subscribe(
      (result) => {
        console.log(`Created new column: ${result}`);
        this.dialogRef.close();
      },
      (error) => {
        console.error(error);
        this.errorMessage = error;
      }
    )
  }
}
