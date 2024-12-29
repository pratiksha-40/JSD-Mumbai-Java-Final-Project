import { Component, OnInit, Input } from '@angular/core';
import { CourseService } from '../../service/course-service.service';

@Component({
  selector: 'app-my-courses',
  templateUrl: './my-courses.component.html',
  styleUrls: ['./my-courses.component.scss'],
})
export class MyCoursesComponent implements OnInit {
  @Input() userId: string = '';  // To pass userId from parent
  purchasedCourses: any[] = [];
  isLoading = true;
  errorMessage = '';

  constructor(private courseService: CourseService) {}

  ngOnInit(): void {
    this.fetchPurchasedCourses();
  }

  fetchPurchasedCourses(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.courseService.getUserCourses(this.userId).subscribe({
      next: (courses) => {
        this.purchasedCourses = courses.map((course: any) => ({
          id: course.id,
          name: course.courseName,
          description: course.courseDescription,
          duration: course.duration,
          price: course.price,
        }));
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching purchased courses:', err);
        this.isLoading = false;
        this.errorMessage = 'Failed to load purchased courses';
      },
    });
  }
}
