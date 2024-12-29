import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';  
import { CourseService } from '../../service/course-service.service'; 
import { CommonModule } from '@angular/common';

interface Course {
  courseName: string;
  courseDescription: string;
  price: number;
  id: number;
}

@Component({
  selector: 'app-home',
  imports:[CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  courses: Course[] = [];
  errorMessage: string | null = null;

  constructor(
    private courseService: CourseService,
    private router: Router  
  ) {}

  ngOnInit() {
    this.getCourses();
  }

  getCourses() {
    this.courseService.getAllCourses().subscribe({
      next: (courses) => {
        this.courses = courses.slice(0, 6);
      },
      error: (err) => {
        console.error('Error fetching courses:', err);
        this.errorMessage = 'Failed to load courses. Please try again later.';
      },
    });
  }

  viewCourseDetails(courseId: number) {
    this.router.navigate(['/course', courseId]);  
  }
}