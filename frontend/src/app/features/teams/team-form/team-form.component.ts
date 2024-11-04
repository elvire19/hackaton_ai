import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { TeamService } from '../services/team.service';
import { HackathonService } from '../../hackathon/services/hackathon.service';
import { AuthService } from '../../../core/auth/auth.service';
import { Mentor, TeamMember1 } from '../models/team.model';
import { MentorService } from '../../mentoring/services/mentor.service';

@Component({
  selector: 'app-team-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './team-form.component.html',
  styleUrls: ['./team-form.component.scss']
})
export class TeamFormComponent implements OnInit {
  teamForm: FormGroup;
  loading = false;
  error = '';
  hackathons: any[] = [];
  isEditMode = false;
  teamId?: number;
  users: TeamMember1[] = [];
  mentors: Mentor[] = [];
  selectedMembers: TeamMember1[] = [];
  selectedMentors: Mentor[] = [];
  loadingMentors = false;
  loadingMembers = false;

  constructor(
    private fb: FormBuilder,
    private teamService: TeamService,
    private authService: AuthService,
    private hackathonService: HackathonService,
    private mentorService: MentorService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.teamForm = this.initializeForm();
  }

  ngOnInit(): void {
    this.loadMembers();
    this.loadMentors();
    this.loadHackathons();
    
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEditMode = true;
      this.teamId = +id;
      this.loadTeam(id);
    }
  }

  private initializeForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(50)]],
      hackathonId: ['', Validators.required],
      memberIds: [[]] // Initialize as empty array
    });
  }

  private loadHackathons(): void {
    this.hackathonService.getHackathons({ status: 'active' }).subscribe({
      next: (response) => {
        this.hackathons = response.data;
      },
      error: (error) => {
        console.error('Error loading hackathons:', error);
        this.error = 'Failed to load hackathons';
      }
    });
  }

  private loadMembers(): void {
    this.loadingMembers = true;
    this.authService.getUsers().subscribe({
      next: (response) => {
        this.users = response;
        this.loadingMembers = false;
      },
      error: (error) => {
        console.error('Error loading members:', error);
        this.error = 'Failed to load members';
        this.loadingMembers = false;
      }
    });
  }

  private loadMentors(): void {
    this.loadingMentors = true;
    this.mentorService.getAllMentors().subscribe({
      next: (response) => {
        this.mentors = response;
        this.loadingMentors = false;
      },
      error: (error) => {
        console.error('Error loading mentors:', error);
        this.error = 'Failed to load mentors';
        this.loadingMentors = false;
      }
    });
  }


  toggleMentor(mentor: Mentor): void {
    const index = this.selectedMentors.findIndex(m => m.id === mentor.id);
    
    if (index === -1) {
      this.selectedMentors = [...this.selectedMentors, mentor];
    } else {
      this.selectedMentors = this.selectedMentors.filter(m => m.id !== mentor.id);
    }

    const mentorIds = this.selectedMentors.map(m => m.id);
    this.teamForm.patchValue({ mentorIds });
    this.teamForm.markAsDirty();
  }


  isMentorSelected(mentorId: number): boolean {
    return this.selectedMentors.some(m => m.id === mentorId);
  }

  toggleMember(member: TeamMember1): void {
    const index = this.selectedMembers.findIndex(m => m.id === member.id);
    
    if (index === -1) {
      // Add member
      this.selectedMembers = [...this.selectedMembers, member];
    } else {
      // Remove member
      this.selectedMembers = this.selectedMembers.filter(m => m.id !== member.id);
    }

    // Update form control with member IDs
    const memberIds = this.selectedMembers.map(m => m.id);
    this.teamForm.patchValue({ memberIds });
    this.teamForm.markAsDirty();
  }

  isMemberSelected(memberId: number): boolean {
    return this.selectedMembers.some(m => m.id === memberId);
  }

  onCancel(): void {
    this.router.navigate(['/teams']);
  }

  private loadTeam(teamId: number): void {
    this.loading = true;
    this.teamService.getTeam(teamId).subscribe({
      next: (team) => {
        this.teamForm.patchValue({
          name: team.name,
          description: team.description,
          hackathonId: team.hackathonId
        });
        
        if (team.Users?.length) {
          this.selectedMembers = team.Users;
          this.teamForm.patchValue({
            memberIds: team.Users.map(user => user.id)
          });
        }
        
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load team details';
        this.loading = false;
        console.error('Error loading team:', error);
      }
    });
  }

  onSubmit(): void {
    if (this.teamForm.invalid) {
      return;
    }

    if (this.selectedMembers.length === 0) {
      this.error = 'Please select at least one team member';
      return;
    }

    this.loading = true;
    this.error = '';

    const teamData = {
      name: this.teamForm.value.name,
      description: this.teamForm.value.description,
      hackathonId: +this.teamForm.value.hackathonId,
      memberIds: this.selectedMembers.map(member => member.id),
      mentorIds: this.selectedMentors.map(mentor => mentor.id) 

    };

    const request$ = this.isEditMode
    ? this.teamService.updateTeam(this.teamId!, teamData)
    : this.teamService.createTeam(teamData);
    
    request$.subscribe({
      next: (team) => {
        this.router.navigate(['/teams', team.id]);
      },
      error: (error) => {
        console.error('Error saving team:', error);
        this.error = 'Failed to save team';
        this.loading = false;
      }
    });
  }
}