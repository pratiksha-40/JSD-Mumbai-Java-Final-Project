import { Component, Input, OnInit } from '@angular/core';
import { CourseService } from '../../service/course-service.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-post-form',
  standalone: true, 
  imports: [CommonModule, FormsModule], 
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.scss'],
})
export class PostFormComponent implements OnInit {
  @Input() courseId: string | null = null; // Input to allow editing of an existing course
  courseName: string = '';
  courseDescription: string = '';
  duration: string = '';
  price: string = '';
  errorMessage: string = '';

  constructor(private courseService: CourseService, private router: Router) {}

  ngOnInit(): void {
    if (this.courseId) {
      this.courseService.getCourseById(this.courseId).subscribe((course) => {
        this.courseName = course.courseName;
        this.courseDescription = course.courseDescription;
        this.duration = course.duration;
        this.price = course.price;
      });
    }
  }

  // Method to handle form submission (Create or Update)
  onSubmit() {
    const newCourse = {
      courseName: this.courseName,
      courseDescription: this.courseDescription,
      duration: this.duration,
      price: this.price,
    };

    if (this.courseId) {
      this.courseService.updateCourse(this.courseId, newCourse).subscribe({
        next: (response) => {
          if (response) {
            alert('Course successfully updated!');
            this.router.navigate(['/admin-dashboard']);
          } else {
            this.errorMessage = 'Failed to update course. Please try again.';
          }
        },
        error: (error) => {
          this.errorMessage = 'An error occurred. Please try again.';
          console.error(error);
        },
      });
    } else {
      this.courseService.createCourse(newCourse).subscribe({
        next: (response) => {
          if (response) {
            alert('Course successfully created!');
            this.router.navigate(['/admin-dashboard']);
          } else {
            this.errorMessage = 'Failed to create course. Please try again.';
          }
        },
        error: (error) => {
          this.errorMessage = 'An error occurred. Please try again.';
          console.error(error);
        },
      });
    }
  }
}
