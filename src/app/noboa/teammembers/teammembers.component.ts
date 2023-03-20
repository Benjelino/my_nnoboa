import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-teammembers',
  templateUrl: './teammembers.component.html',
  styleUrls: ['./teammembers.component.scss'],
})
export class TeammembersComponent implements OnInit {

  constructor() { }

  ngOnInit() {}

  fullName: string;
  email: string;
  imageUrl: string;
  role: string;

  teamMembers: any[] = [];

  onFileSelected(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.imageUrl = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  addTeamMember() {
    const teamMember = {
      fullName: this.fullName,
      email: this.email,
      imageUrl: this.imageUrl,
      role: this.role,
    };
    this.teamMembers.push(teamMember);
    this.clearForm();
  }

  clearForm() {
    this.fullName = '';
    this.email = '';
    this.imageUrl = '';
    this.role = '';
  }

}
