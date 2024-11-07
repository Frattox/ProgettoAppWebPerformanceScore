import { Component, inject } from '@angular/core';
import {FormBuilder, Validators, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatStepperModule} from '@angular/material/stepper';
import {MatButtonModule} from '@angular/material/button';
import { SelectorComponent } from "./generali/selector/selector.component";
import { ContComponent } from "./generali/cont/cont.component";
import { HttpClient } from '@angular/common/http';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-component',
  standalone: true,
  imports: [
    MatButtonModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    SelectorComponent,
    ContComponent,
    MatProgressSpinnerModule,
    CommonModule
],
  templateUrl: './my-component.component.html',
  styleUrl: './my-component.component.css',
})
export class MyComponentComponent {

  private http = inject(HttpClient);

  isLoading: boolean = false;

  valuesGenerali: any;
  valuesAzienda: any;
  valuesOreGiorni: any;
  valuesAltro: any;

  response: any | null = null;

  private _formBuilder = inject(FormBuilder);

  genderOptions = [
    {value:1,label:'Male'},
    {value:2,label:'Female'},
    {value:3,label:'Other'}
  ];
  getGenderLabel(value: any) {
    const option = this.genderOptions.find(option => option.value === value);
    return option ? option.label : null;
  }  
  educationOptions = [
    {value:1,label:'High School'},
    {value:2,label:'Bachelor'},
    {value:3,label:'Master'},
    {value:4,label:'PhD'}
  ];
  getEducationLabel(value: any) {
    const option = this.educationOptions.find(option => option.value === value);
    return option ? option.label : null;
  }
  
  jobOptions = [
    {value:1,label:'Specialist'},
    {value:2,label:'Developer'},
    {value:3,label:'Analyst'},
    {value:4,label:'Manager'},
    {value:5,label:'Technician'},
    {value:6,label:'Engineer'},
    {value:7,label:'Consultant'}
  ];
  getJobLabel(value: any) {
    const option = this.jobOptions.find(option => option.value === value);
    return option ? option.label : null;
  }
  
  departmentOptions = [
    {value:1,label:'IT'},
    {value:2,label:'Finance'},
    {value:3,label:'Customer Support'},
    {value:4,label:'Engineering'},
    {value:5,label:'Marketing'},
    {value:6,label:'HR'},
    {value:7,label:'Operations'},
    {value:8,label:'Sales'},
    {value:9,label:'Legal'},
  ];
  getDepartmentLabel(value: any) {
    const option = this.departmentOptions.find(option => option.value === value);
    return option ? option.label : null;
  }
  
  remoteOptions = [
    {value:1,label:'0'},
    {value:2,label:'25'},
    {value:3,label:'50'},
    {value:4,label:'75'},
    {value:5,label:'100'},
  ];
  getRemoteLabel(value: any) {
    const option = this.remoteOptions.find(option => option.value === value);
    return option ? parseInt(option.label) : null;
  }
  
  resignedOptions = [
    {value:1,label:'Si'},
    {value:0,label:'No'}
  ];
  getResignedLabel(value: any) {
    const option = this.resignedOptions.find(option => option.value === value);
    return option ? option.label : null;
  }
  


  generaliGroup = this._formBuilder.group({
    gender: ['', Validators.required],
    age: ['', Validators.required],
    education_level: ['', Validators.required],
  });
  aziendaGroup = this._formBuilder.group({
    job_title: ['', Validators.required],
    monthly_salary: ['', Validators.required],
    department: ['', Validators.required],
    team_size: ['', Validators.required],
  });
  
  oreGiorniGroup = this._formBuilder.group({
    work_hours_per_week: ['', Validators.required],
    training_hours: ['', Validators.required],
    remote_work_frequency: ['', Validators.required],
    overtime_hours: ['', Validators.required],
    sick_days: ['', Validators.required],
  });
  
  altroGroup = this._formBuilder.group({
    employee_satisfaction_score: ['', Validators.required],
    promotions: ['', Validators.required],
    projects_handled: ['', Validators.required],
    years_at_company: ['', Validators.required],
    resigned: ['', Validators.required],
  });

  getFormGeneraliValues() {
    this.valuesGenerali = this.generaliGroup.value;
  }
  getFormAziendaValues() {
    this.valuesAzienda = this.aziendaGroup.value;
  }
  getFormOreGiorniValues() {
    this.valuesOreGiorni = this.oreGiorniGroup.value;
  }
  getFormAltroValues() {
    this.valuesAltro = this.altroGroup.value;
  }

  submitData() {
    //raccolgo i dati
    const allData = {
      ...this.valuesGenerali,
      ...this.valuesAzienda,
      ...this.valuesOreGiorni,
      ...this.valuesAltro
    };

    this.isLoading = true;

    allData.gender = this.getGenderLabel(this.valuesGenerali.gender);
    allData.education_level = this.getEducationLabel(this.valuesGenerali.education_level);
    allData.job_title = this.getJobLabel(this.valuesAzienda.job_title);
    allData.department = this.getDepartmentLabel(this.valuesAzienda.department);
    allData.remote_work_frequency = this.getRemoteLabel(this.valuesOreGiorni.remote_work_frequency);
    allData.resigned = this.getResignedLabel(this.valuesAltro.resigned);


    //invio attraverso una richiesta HTTP di tipo POST
    this.http.post<any>('http://127.0.0.1:5000/', allData).subscribe({
      next: (response:any) => {
        console.log('Risposta dal backend:', response);
        this.response = response;
      },
      error: (error:any) => {
        console.error('Errore nella richiesta:', error);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}
