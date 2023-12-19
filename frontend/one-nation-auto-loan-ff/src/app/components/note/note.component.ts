import {
  Component,
  EventEmitter,
  Output,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { NoteDetail } from 'src/app/interfaces/note';
import { ApiService } from 'src/app/services/api.service';
import { DataService } from 'src/app/services/data.service';
import * as moment from 'moment';

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.css'],
})
export class NoteComponent implements OnInit, OnDestroy {
  constructor(
    private fb: FormBuilder,
    private dataService: DataService,
    private apiService: ApiService
  ) {}

  @Output() closeNoteButtonClicked = new EventEmitter<any>();
  noteForm!: FormGroup;
  singleNoteForm!: FormGroup;
  applicant = '';
  applicantPhone: string | undefined;
  applicantAddress: string | undefined;
  applicantEmail: string | undefined;
  private addNoteSubscription?: Subscription;

  ngOnInit(): void {
    this.noteForm = this.fb.group({
      pk: [''],
      sk: [''],
      gsI1PK: [''],
      gsI1SK: [''],
      documentType: [''],
      notes: this.fb.array([]),
    });

    //set initial note
    if (!this.dataService.isEditModeNote()) {
      this.addNote();
    }

    if (this.dataService?.primaryApplicant !== null) {
      //debugger;
      const { fullName } = this.dataService.primaryApplicant;
      this.applicant = fullName;
      this.applicantPhone = this.dataService.currentApplicant?.phone;
      this.applicantEmail = this.dataService.currentApplicant?.email;
      this.applicantAddress = `${this.dataService.currentApplicant?.address[0].street} 
       ${this.dataService.currentApplicant?.address[0].city} 
       ${this.dataService.currentApplicant?.address[0].province} 
       ${this.dataService.currentApplicant?.address[0].postalCode} ${this.dataService.currentApplicant?.address[0].country}`;
    }

    if (this.dataService.isEditModeNote()) {
      if (this.dataService.currentNote != undefined) {
        const { notes, ...otherFormdata } = this.dataService.currentNote;
        console.log(JSON.stringify(notes));
        this.noteForm.patchValue(otherFormdata);
        if (notes?.length > 0) {
          this.setNotes(notes);
        }
      }
    }
  }

  addNoteFormGroup(note: NoteDetail): FormGroup {
    return this.fb.group({
      noteText: note.noteText,
      createdBy: note.createdBy,
      createdDate: moment(note.createdDate).format('MM/DD/YYYY h:mm:ss a'),
      updatedBy: note.updatedBy,
      updatedDate: moment(note.updatedDate).format('MM/DD/YYYY  h:mm:ss a'),
    });
  }

  addNotes(noteInput: NoteDetail): FormGroup {
    // debugger;
    const note = this.addNoteFormGroup(noteInput);
    (<FormArray>this.noteForm.get('notes')).push(note);
    return note;
  }

  setNotes(notes: NoteDetail[]): void {
    notes.forEach((note) => {
      const addedNotes = this.addNotes(note);
    });
  }

  submit() {
    // debugger;
    const currentNote = this.noteForm.getRawValue();
    const appId = this.dataService.getPrimaryApplicantId();
    const userId = this.dataService.getLoggedInUserId();
    if (currentNote != null && userId != null) {
      if (this.dataService.isEditModeNote()) {
        const { pk, sk } = currentNote;
        this.addNoteSubscription = this.apiService
          .updateNote(currentNote, userId, pk, sk)
          .subscribe({
            next: (data) => {
              const message = 'Note updated Successfully';
              this.dataService.currentNote = data;
              this.dataService.isEditModeNote.set(true);
              this.dataService.showSucess(message);
              console.log(JSON.stringify(this.dataService.currentNote));
              this.close();
            },
            error: (error) => {
              const message = 'Note update Failed';
              this.dataService.showError(message);
            },
          });
      } else {
        const { pk, sk, gsI1PK, gsI1SK, ...data } = currentNote;
        this.addNoteSubscription = this.apiService
          .createNote(data, userId, appId)
          .subscribe({
            next: (data) => {
              const message = 'Note created Successfully';
              this.dataService.currentNote = data;
              this.dataService.isEditModeNote.set(true);
              this.dataService.showSucess(message);
              console.log(JSON.stringify(this.dataService.currentNote));
              this.close();
            },
            error: (error) => {
              const message = 'Vehicle create Failed';
              this.dataService.showError(message);
            },
          });
      }
    }
  }

  clear() {
    this.noteForm.reset();
  }

  close() {
    this.closeNoteButtonClicked.emit('note');
  }

  addNote(): void {
    const note = this.noteFormGroup();
    (<FormArray>this.noteForm.get('notes')).push(note);
  }

  noteFormGroup(): FormGroup {
    return this.fb.group({
      noteText: [''],
      createdBy: [this.dataService.getLoggedInUserId()],
      createdDate: [moment(Date.now()).format('MM/DD/YYYY  h:mm:ss a')],
      updatedBy: [''],
      updatedDate: [''],
    });
  }

  removeNote(i: number): void {
    if (i !== 0) {
      (<FormArray>this.noteForm.get('notes')).removeAt(i);
    }
  }

  getAllNote(): FormArray {
    //const entities = this.noteForm.get('note') as FormArray;
    return this.noteForm.get('notes') as FormArray;
  }

  isNoteExists(): number {
    return this.getAllNote().controls.length;
  }

  ngOnDestroy(): void {
    this.addNoteSubscription?.unsubscribe();
  }
}
