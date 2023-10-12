import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.css'],
})
export class NoteComponent implements OnInit {
  constructor(private fb: FormBuilder, private dataService: DataService) {}

  @Output() closeNoteButtonClicked = new EventEmitter<any>();
  noteForm!: FormGroup;
  applicant = '';

  ngOnInit(): void {
    this.noteForm = this.fb.group({
      note: [''],
    });

    this.applicant = `${this.dataService.primaryApplicant?.firstName} ${this.dataService.primaryApplicant?.lastName}`;
  }

  submit() {
    console.log(this.noteForm.getRawValue());
  }

  clear() {
    this.noteForm.reset();
  }

  close() {
    this.closeNoteButtonClicked.emit('note');
  }
}
