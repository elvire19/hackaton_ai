import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { HackathonService } from '../services/hackathon.service';
import { Hackathon, EvaluationCriteria } from '../models/hackathon.model';

@Component({
  selector: 'app-hackathon-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './hackathon-form.component.html',
  styleUrls: ['./hackathon-form.component.scss']
})
export class HackathonFormComponent implements OnInit {
  hackathonForm: FormGroup = this.initializeForm();
  loading = false;
  error = '';
  success = '';
  isEditMode = false;
  hackathonId?: number;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private hackathonService: HackathonService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEditMode = true;
      this.hackathonId = parseInt(id);
      this.loadHackathon(this.hackathonId);
    }
  }

  private initializeForm(): FormGroup {
    return this.fb.group({
      name: ['', [
        Validators.required, 
        Validators.minLength(5),
        Validators.maxLength(100)
      ]],
      description: ['', [
        Validators.required, 
        Validators.minLength(20),
        Validators.maxLength(1000)
      ]],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
      maxTeamSize: [5, [
        Validators.required, 
        Validators.min(2), 
        Validators.max(10)
      ]],
      status: ['draft', [Validators.required]],
      partners: this.fb.array([]),
      evaluationCriteria: this.fb.group({
        innovation: this.fb.group({
          weight: [0.3, [
            Validators.required, 
            Validators.min(0), 
            Validators.max(1)
          ]]
        }),
        impact: this.fb.group({
          weight: [0.3, [
            Validators.required, 
            Validators.min(0), 
            Validators.max(1)
          ]]
        }),
        feasibility: this.fb.group({
          weight: [0.2, [
            Validators.required, 
            Validators.min(0), 
            Validators.max(1)
          ]]
        }),
        presentation: this.fb.group({
          weight: [0.2, [
            Validators.required, 
            Validators.min(0), 
            Validators.max(1)
          ]]
        })
      }, { validators: this.weightSumValidator })
    }, { validators: this.dateRangeValidator });
  }

  private loadHackathon(id: number): void {
    this.loading = true;
    this.hackathonService.getHackathon(id).subscribe({
      next: (hackathon) => {
        this.patchFormWithHackathon(hackathon);
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load hackathon details';
        this.loading = false;
        console.error('Error loading hackathon:', error);
      }
    });
  }

  private patchFormWithHackathon(hackathon: Hackathon): void {
    while (this.partners.length) {
      this.partners.removeAt(0);
    }

    if (hackathon.partners?.length) {
      hackathon.partners.forEach(partner => {
        this.partners.push(this.createPartnerFormGroup(
          partner.name,
          partner.website,
          partner.logo
        ));
      });
    }

    this.hackathonForm.patchValue({
      name: hackathon.name,
      description: hackathon.description,
      startDate: this.formatDate(new Date(hackathon.startDate)),
      endDate: this.formatDate(new Date(hackathon.endDate)),
      maxTeamSize: hackathon.maxTeamSize,
      status: hackathon.status,
      evaluationCriteria: hackathon.evaluationCriteria
    });
  }

  private createPartnerFormGroup(name = '', website = '', logo = ''): FormGroup {
    return this.fb.group({
      name: [name, [Validators.required, Validators.minLength(2)]],
      website: [website, [
        Validators.required, 
        Validators.pattern('https?://.+')
      ]],
      logo: [logo, [
        Validators.required,
        Validators.pattern('https?://.+\\.(png|jpg|jpeg|gif|svg)$')
      ]]
    });
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  private dateRangeValidator(group: FormGroup): null | { dateRange: boolean } {
    const start = group.get('startDate')?.value;
    const end = group.get('endDate')?.value;

    if (!start || !end) return null;

    return new Date(start) < new Date(end) ? null : { dateRange: true };
  }

  private weightSumValidator(group: FormGroup): null | { weightSum: boolean } {
    const criteria = group.value as EvaluationCriteria;
    const sum = Object.values(criteria).reduce((acc, curr) => acc + curr.weight, 0);
    return Math.abs(sum - 1) < 0.01 ? null : { weightSum: true };
  }

  get partners(): FormArray {
    return this.hackathonForm.get('partners') as FormArray;
  }

  addPartner(): void {
    this.partners.push(this.createPartnerFormGroup());
  }

  removePartner(index: number): void {
    this.partners.removeAt(index);
  }

  validateAllFormFields(formGroup: FormGroup | FormArray): void {
    Object.values(formGroup.controls).forEach(control => {
      if (control instanceof FormGroup || control instanceof FormArray) {
        this.validateAllFormFields(control);
      }
      control.markAsTouched();
    });
  }

  getErrorMessage(control: any, fieldName: string): string {
    if (!control) return '';
    
    if (control.hasError('required')) {
      return `${fieldName} is required`;
    }
    
    if (control.hasError('minlength')) {
      return `${fieldName} must be at least ${control.errors.minlength.requiredLength} characters`;
    }
    
    if (control.hasError('maxlength')) {
      return `${fieldName} cannot exceed ${control.errors.maxlength.requiredLength} characters`;
    }
    
    if (control.hasError('min')) {
      return `${fieldName} must be at least ${control.errors.min.min}`;
    }
    
    if (control.hasError('max')) {
      return `${fieldName} cannot exceed ${control.errors.max.max}`;
    }
    
    if (control.hasError('pattern')) {
      if (fieldName.toLowerCase().includes('url') || fieldName.toLowerCase().includes('logo')) {
        return `Please enter a valid URL`;
      }
      return `Invalid ${fieldName} format`;
    }
    
    return '';
  }

  onSubmit(): void {
    this.submitted = true;
    
    if (this.hackathonForm.invalid) {
      this.validateAllFormFields(this.hackathonForm);
      this.error = 'Please fix the validation errors before submitting.';
      return;
    }

    this.loading = true;
    this.error = '';

    const hackathonData = {
      ...this.hackathonForm.value,
      statistics: {
        participantCount: 0,
        teamCount: 0,
        projectCount: 0,
        mentoringSessions: {
          total: 0,
          scheduled: 0,
          completed: 0,
          cancelled: 0
        }
      }
    };

    const request$ = this.isEditMode
      ? this.hackathonService.updateHackathon(this.hackathonId!, hackathonData)
      : this.hackathonService.createHackathon(hackathonData);

      request$.subscribe({
        next: () => {
          this.success = `Hackathon successfully ${this.isEditMode ? 'updated' : 'created'}!`;
          setTimeout(() => {
            this.router.navigate(['/hackathons']);
          }, 1500);
        },
        error: (error) => {
          this.error = 'Failed to save hackathon. Please try again.';
          this.loading = false;
          console.error('Error saving hackathon:', error);
        }
      });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.hackathonForm.get(fieldName);
    return field ? (field.invalid && (field.dirty || field.touched || this.submitted)) : false;
  }

  isPartnerFieldInvalid(partnerIndex: number, fieldName: string): boolean {
    const partner = this.partners.at(partnerIndex);
    const field = partner.get(fieldName);
    return field ? (field.invalid && (field.dirty || field.touched || this.submitted)) : false;
  }

  isCriteriaInvalid(criteriaName: string): boolean {
    const criteria = this.hackathonForm.get(`evaluationCriteria.${criteriaName}.weight`);
    return criteria ? (criteria.invalid && (criteria.dirty || criteria.touched || this.submitted)) : false;
  }
}