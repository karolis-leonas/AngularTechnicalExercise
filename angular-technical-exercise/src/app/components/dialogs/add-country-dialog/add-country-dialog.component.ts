import { CountryDialogData } from './../../../models/country-dialog-data.model';
import { TableService } from './../../../services/table.service';
import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, Validators, AbstractControl, FormBuilder, FormControl, FormArray } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-add-country-dialog',
  templateUrl: './add-country-dialog.component.html',
  styleUrls: ['./add-country-dialog.component.css']
})

export class AddCountryDialogComponent implements OnInit {
  countryForm: FormGroup;

  loading = false;
  submitted = false;
  errorMessage: string = null;
  oldCountryCode: string = null;

  constructor(
    public dialogRef: MatDialogRef<AddCountryDialogComponent>,
    private _formBuilder: FormBuilder,
    private _tableService: TableService,
    @Inject(MAT_DIALOG_DATA) public dialogData: CountryDialogData) {}

  ngOnInit() {
    this.oldCountryCode = this.dialogData.countryInfo.countryCode;

    this.countryForm = this._formBuilder.group({
      name: [this.dialogData.countryInfo.name, Validators.required ],
      countryCode: [this.dialogData.countryInfo.countryCode, Validators.compose(
        [Validators.required, Validators.minLength(2), Validators.maxLength(2)])
      ],
      phoneCode: [this.dialogData.countryInfo.phoneCode, Validators.required ],
      additionalData: this.setAdditionalDataForm()
    });
  }

  get name(): AbstractControl {
    return this.countryForm.get('name');
  }

  get countryCode(): AbstractControl {
    return this.countryForm.get('countryCode');
  }

  get phoneCode(): AbstractControl {
    return this.countryForm.get('phoneCode');
  }

  closeModal(): void {
      this.dialogRef.close();
  }

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = null;

    if (this.countryForm.invalid) {
        return;
    }
    this.loading = true;
    if (this.oldCountryCode) {
      this._tableService.updateExistingCountry(this.countryForm.value, this.oldCountryCode).subscribe(
        (result) => {
          console.log('Updated country');
          console.log(result);
          this.dialogRef.close();
        },
        (error) => {
          this.errorMessage = error;
        });

    } else {
      this._tableService.createNewCountry(this.countryForm.value).subscribe(
        (result) => {
          console.log('Created country');
          console.log(result);
          this.dialogRef.close();
        },
        (error) => {
          console.error(error);
          this.errorMessage = error;
        });
    }
  }

  private setAdditionalDataForm() {
    let additionalDataFormControl = this._formBuilder.group({});

    if (this.dialogData.additionalColumns.length > 0) {
      this.dialogData.additionalColumns.forEach(columnName => {
        const formValue = (this.dialogData.countryInfo.additionalData && this.dialogData.countryInfo.additionalData[columnName])
          ? this.dialogData.countryInfo.additionalData[columnName] : '';

        additionalDataFormControl.addControl(columnName, new FormControl(formValue, []));
      });
    }

    return additionalDataFormControl;
  }
}
