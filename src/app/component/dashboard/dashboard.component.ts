import { Component, OnInit } from '@angular/core';
import { Movies } from 'src/app/model/movies';
import { CrudService } from 'src/app/service/crud.service';
import {
  faMasksTheater,
  faPen,
  faPenRuler,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  moviesObj: Movies = new Movies();
  moviesArr: Movies[] = [];

  selectedGenres: any = {
    drama: false,
    sciFi: false,
    animation: false,
    horror: false,
    action: false,
  };

  addTitle: string = '';
  addDirector: string = '';
  addSummary: string = '';
  addGenres: string = '';

  editTitle: string = '';
  editDirector: string = '';
  editSummary: string = '';
  editGenres: string = '';

  searchTitle: string = '';

  faMasksTheater = faMasksTheater;
  faMagicWandSparkles = faPen;
  faPenRuler = faPenRuler;
  faPlus = faPlus;

  errors: any = [];

  genres = [
    { name: 'Drama', selected: false },
    { name: 'Action', selected: false },
    { name: 'Sci-Fi', selected: false },
    { name: 'Animation', selected: false },
    { name: 'Horror', selected: false },
  ];

  constructor(private crudService: CrudService) { }

  getSelectedGenresAsString(): string {
    const selectedGenresArray = Object.keys(this.selectedGenres).filter(
      (genre) => this.selectedGenres[genre]
    );
    return selectedGenresArray.join('/ ');
  }

  ngOnInit(): void {
    // Move the initialization code to a separate function for reusability.
    this.resetFormFields();
    this.getAllMovies();
    this.reloadPage();
  }

  saveForm = new FormGroup({
    titleValue: new FormControl("", [
      Validators.required,
      Validators.minLength(2)]),
    director: new FormControl(""),
    summary: new FormControl(""),
    genres: new FormControl(""),
  })

  get Title(): FormControl {
    return this.saveForm.get("titleValue") as FormControl;
  }
  get Director(): FormControl {
    return this.saveForm.get("director") as FormControl;
  }
  get Summary(): FormControl {
    return this.saveForm.get("summary") as FormControl;
  }
  get Genres(): FormControl {
    return this.saveForm.get("genres") as FormControl;
  }

  // Create a function to reset all form fields to their initial state.
  resetFormFields() {
    this.selectedGenres.drama = false;
    this.selectedGenres.sciFi = false;
    this.selectedGenres.animation = false;
    this.selectedGenres.horror = false;
    this.selectedGenres.action = false;
    this.genres.forEach(genre => {
      genre.selected = false;
    });
    this.searchTitle = '';
    this.editTitle = '';
    this.editDirector = '';
    this.editSummary = '';
    this.editGenres = '';
    this.addTitle = '';
    this.addDirector = '';
    this.addSummary = '';
    this.addGenres = '';
    this.moviesObj = new Movies();
  }

  getAllMovies() {
    this.crudService.getAllMovies().subscribe(
      (res) => {
        this.moviesArr = res;
      },
      (err) => {
        alert('Unable to get the list of movies');
      }
    );
  }

  addMovies() {
    this.moviesObj.title = this.addTitle;
    this.moviesObj.director = this.addDirector;
    this.moviesObj.summary = this.addSummary;
    this.moviesObj.genres = this.getSelectedGenresAsString(); // Use `join` to concatenate genres

    this.crudService.addMovies(this.moviesObj).subscribe(
      (res) => {
        this.resetFormFields(); // Reset the form fields after adding a movie
        this.getAllMovies();
        window.alert("Created")
      }, (err) => {
        this.errors = err.error;
        console.log(err, 'errors');
        this.getAllMovies();
        // alert(err);
      }
    );
  }

  updateMovies() {
    this.moviesObj.title = this.editTitle;
    this.moviesObj.director = this.editDirector;
    this.moviesObj.summary = this.editSummary;
    this.moviesObj.genres = this.getSelectedGenresAsString(); // Use `join` to concatenate genres

    this.crudService.updateMovies(this.moviesObj).subscribe(
      (res) => {
        // this.resetFormFields(); // Reset the form fields after adding a movie
        this.getAllMovies();
        window.alert("Updated")
      },
      (err) => {
        this.errors = err.error;
        this.getAllMovies();
        console.log(err, 'errors');        
        // alert(err);
      }
    );
  }

  deleteMovies(emovies: Movies) {
    this.crudService.deleteMovies(emovies).subscribe(
      (res) => {
        this.getAllMovies();
        window.alert("Deleted")
      },
      (err) => {
        alert('Failed to delete movies.');
      }
    );
  }

  call(emovies: Movies) {
    this.moviesObj = emovies;
    this.editTitle = emovies.title;
    this.editDirector = emovies.director;
    this.editSummary = emovies.summary;
    this.editGenres = emovies.genres;
    const genresArray = this.editGenres.split('/ ');
    for (const genre of genresArray) {
      if (this.selectedGenres.hasOwnProperty(genre)) {
        this.selectedGenres[genre] = true;
      }
    }
  }

  searchMovies() {
    this.moviesObj.title = this.searchTitle;
    this.crudService.searchMovies(this.moviesObj).subscribe(
      (res) => {
        this.moviesArr = res;
      },
      (err) => {
        this.resetFormFields(); // Reset the form fields after editing a movie
        this.getAllMovies();
      }
    );
  }

  reloadPage() {
    this.addTitle = '';
    this.addDirector = '';
    this.addSummary = '';
    this.editTitle = '';
    this.editDirector = '';
    this.editSummary = '';
    this.selectedGenres = {
      drama: false,
      sciFi: false,
      animation: false,
      horror: false,
      action: false
    };
    this.errors = {};

  }
}
