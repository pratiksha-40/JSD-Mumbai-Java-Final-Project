import { Component, OnInit } from '@angular/core';
import { CourseService } from '../../service/course-service.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PostFormComponent } from '../post-form/post-form.component';

@Component({
  selector: 'app-admin-dashbord',
  standalone: true, 
  imports: [CommonModule, PostFormComponent], 
  templateUrl: './admin-dashbord.component.html',
  styleUrls: ['./admin-dashbord.component.scss']
})
export class AdminDashbordComponent implements OnInit {
  showPostForm: boolean = false;
  courses: any[] = []; // List of courses
  selectedCourseId: string = ''; // To track the selected course for editing

  constructor(private courseService: CourseService, private router: Router) {}

  ngOnInit(): void {
    this.loadCourses();
  }

  // Load all courses
  loadCourses() {
    this.courseService.getAllCourses().subscribe((courses) => {
      this.courses = courses;
    });
  }

  // Toggle the visibility of the post form
  togglePostForm() {
    this.showPostForm = !this.showPostForm;
    console.log('Post form visibility:', this.showPostForm); 
  }

  // Edit a course (set selected course for editing)
  editCourse(course: any) {
    this.selectedCourseId = course.id;
    this.showPostForm = true;
  }

  // Delete a course
  deleteCourse(courseId: number) {
    if (confirm('Are you sure you want to delete this course?')) {
      this.courseService.deleteCourse(courseId).subscribe(() => {
        this.loadCourses(); // Reload courses after deletion
      });
    }
  }
}
