import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { StoreService, ApiService } from 'app/services';
import { IForeignKey, IDateTakenLatestPhoto, IFilters } from 'app/model';
import { element } from 'protractor';
import * as moment from 'moment';

@Component({
  selector: 'fg-albums',
  templateUrl: './albums.component.html',
  styleUrls: ['./albums.component.scss']
})

export class AlbumsComponent implements OnInit {
  public filterForm: FormGroup;
  semester = [];
  latest_date = ''; // format: YYYY-MM-DD
  latest_week = null;

  constructor(
    private fb: FormBuilder,
    private api: ApiService
  ) { }

  ngOnInit() {
    this.calculateSemesters();
    this.filterForm = this.fb.group({
      semester: [0, []]
    });
    this.getDateAndWeekOfLastPhotoTaken();
    this.getAlbumHeader();
  }

  calculateSemesters() {
    const semesters = ['V', 'H'];
    let begin, end;
    let identificator = 0;
    // check if the current date is in the fall or spring semester. end of semester = 1. july:
    new Date().getMonth() + 1 < 6
      ? ((begin = 0), (end = 1))
      : ((begin = 1), (end = 0));

    // adding semesters to semesterlist
    for (let year = new Date().getFullYear(); year >= 1910; year--) {
      this.semester.push(
        { id: identificator++, name: semesters[begin] + year },
        { id: identificator++, name: semesters[end] + year }
      );
    }
  }

  getDateAndWeekOfLastPhotoTaken() {
    const test = this.api.getDateOfLatestPhotoTaken().subscribe(element => {
      this.latest_date = element.latest_date.substring(0, 10);
      console.log(this.latest_date);
      this.latest_week = moment(this.latest_date, 'YYYY-MM-DD')
        .isoWeekday(1)
        .isoWeek();
      console.log(this.latest_week);
    });
  }

  getAlbumHeader() {
    this.api.getWeeklyAlbumHeader().subscribe(element => {
      console.log(element);
    });
  }
}
