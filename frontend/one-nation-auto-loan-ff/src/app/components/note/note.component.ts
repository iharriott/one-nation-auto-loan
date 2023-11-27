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
    });
  }

  addNotes(addressInput: NoteDetail): FormGroup {
    const note = this.addNoteFormGroup(addressInput);
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
          .subscribe((data) => {
            this.dataService.currentNote = data;
            console.log(JSON.stringify(this.dataService.currentNote));
            this.close();
          });
      } else {
        const { pk, sk, gsI1PK, gsI1SK, ...data } = currentNote;
        this.addNoteSubscription = this.apiService
          .createNote(data, userId, appId)
          .subscribe((data) => {
            this.dataService.currentNote = data;
            console.log(JSON.stringify(this.dataService.currentNote));
            this.close();
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
