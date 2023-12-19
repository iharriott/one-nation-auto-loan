export interface Note {
  pk: string;
  sk: string;
  gsI1PK: string;
  gsI1SK: string;
  documentType: string;
  notes: NoteDetail[];
  createdBy: string;
  createdDate: Date;
  updatedBy: string;
  updatedDate: Date;
}

export interface NoteDetail {
  noteText: string;
  createdBy: string;
  createdDate: Date;
  updatedBy: string;
  updatedDate: Date;
}
