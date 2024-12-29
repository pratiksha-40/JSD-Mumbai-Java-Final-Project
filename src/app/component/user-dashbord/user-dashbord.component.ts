import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CourseService } from '../../service/course-service.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-dashbord',
  imports: [CommonModule],
  templateUrl: './user-dashbord.component.html',
  styleUrls: ['./user-dashbord.component.scss'],
})
export class UserDashbordComponent implements OnInit {
  purchasedCourses: any[] = [];
  allCourses: any[] = [];
  selectedCourse: any | null = null;
  isLoading = true;
  showAllCourses = false;
  showMyCourses = false;
  userId: string = '';
  viewState = 'loading';  // New flag to manage view state

  constructor(private courseService: CourseService, private router: Router) {}

  ngOnInit(): void {
    this.userId = 'user-id'; // Replace with dynamic user ID
    console.log('Initializing dashboard for user:', this.userId);
    this.fetchAllCourses();
  }

  fetchAllCourses(): void {
    this.viewState = 'loading';
    console.log('Fetching all courses...');
    this.courseService.getAllCourses().subscribe({
      next: (courses) => {
        console.log('Response received for all courses:', courses);
        this.allCourses = courses.map((course: any) => ({
          id: course.id,
          name: course.courseName,
          description: course.courseDescription,
          duration: course.duration,
          price: course.price,
        }));
        console.log('Transformed all courses:', this.allCourses);
        this.isLoading = false;
        this.viewState = 'allCourses'; // Show all courses after fetching
        this.showAllCourses = true;
        this.showMyCourses = false;
      },
      error: (err) => {
        console.error('Error fetching all courses:', err);
        this.isLoading = false;
        this.viewState = 'error';
      },
    });
  }

  fetchPurchasedCourses(): void {
    this.viewState = 'loading';
    console.log('Fetching purchased courses for user:', this.userId);
    this.courseService.getUserCourses(this.userId).subscribe({
      next: (courses) => {
        console.log('Response received for purchased courses:', courses);
        this.purchasedCourses = courses.map((course: any) => ({
          id: course.id,
          name: course.courseName,
          description: course.courseDescription,
          duration: course.duration,
          price: course.price,
        }));
        console.log('Transformed purchased courses:', this.purchasedCourses);
        this.isLoading = false;
        this.viewState = 'myCourses'; // Show my courses after fetching
        this.showMyCourses = true;
        this.showAllCourses = false;
      },
      error: (err) => {
        console.error('Error fetching purchased courses:', err);
        this.isLoading = false;
        this.viewState = 'error';
      },
    });
  }

  viewCourseDetails(courseId: number): void {
    console.log('Fetching details for course ID:', courseId);
    this.courseService.getCourseById(courseId).subscribe({
      next: (course) => {
        console.log('Response received for course details:', course);
        this.selectedCourse = {
          id: course.id,
          name: course.courseName,
          description: course.courseDescription,
          duration: course.duration,
          price: course.price,
        };
        console.log('Selected course details:', this.selectedCourse);
      },
      error: (err) => {
        console.error('Error fetching course details:', err);
      },
    });
  }

  viewAllCourses(): void {
    console.log('Switching to All Courses view');
    this.fetchAllCourses();  // Directly fetch all courses
  }

  viewPurchasedCourses(): void {
    console.log('Switching to My Courses view');
    this.fetchPurchasedCourses();  // Directly fetch purchased courses
  }

  logout(): void {
    console.log('User logged out');
    this.router.navigate(['/login']);
  }

  purchaseCourse(course: any): void {
    // Assuming course purchase is successful
    console.log('Purchasing course:', course);
    
    // Add the purchased course to the user's purchased courses
    this.purchasedCourses.push(course);

    // Update the view and show the success message
    this.showMyCourses = true;
    this.showAllCourses = false;

    // Optionally, update the backend to reflect the user's purchase (if required)
    this.courseService.purchaseCourse(this.userId, course.id).subscribe(() => {
      // Handle successful purchase (e.g., update UI or show confirmation)
    });

    alert(`Course "${course.name}" successfully purchased!`);
  }

  isCoursePurchased(courseId: number): boolean {
    return this.purchasedCourses.some(course => course.id === courseId);
  }
}
