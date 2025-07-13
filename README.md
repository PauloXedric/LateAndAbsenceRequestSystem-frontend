# Late and Absence Request System - Frontend (Angular)

This is the frontend client for the Late and Absence Request System — a modern Angular application that allows students to submit absence/lateness requests and enables administrators to manage approvals, notifications, and request tracking in real time.

> Institutional names have been omitted for privacy.

---

## Built With

- **Angular 19**
- **PrimeNG 19** – UI components
- **JWT & Angular Guards** – Secure routes and API requests
- **SignalR** – Real-time notifications
- **EmailJS** – Frontend-triggered transactional emails
- **RxJS & Forms** – Reactive and template-driven forms
- **SCSS + PrimeFlex** – Styling and responsive layout

---

## JWT Authentication & Guards

- Uses `@auth0/angular-jwt` to attach JWTs to requests.
- Route access is protected using Angular route guards.
- Tokens are decoded and validated client-side for secure flow.

---

## EmailJS Integration

EmailJS is used for multiple notification workflows:
1. **Student Notifications** – Students are notified at each step (approved and declined).
2. **Supporting Document Uploads** – Students receive a secure JWT link via email to upload required documents.
3. **Admin Password Reset** – Admins receive a password reset link triggered from the frontend.
4. **Admin Registration** - Newly invited user will receive secure JWT link via email for registration.

---

## Real-Time Features

- **SignalR Integration** allows administrators to receive real-time notifications for new request submissions, synced across roles (Secretary, Chairperson, Director).

---

## Features Overview

- Login/Register via JWT (admin and student)
- Request submission and history
- Upload supporting documents
- Admin approval workflow with real-time updates
- Notification bell using SignalR
- EmailJS-powered status updates and password resets
- Password reset and account recovery
- Filtering and table components using PrimeNG

---

## Backend API

This frontend connects to the [Late and Absence Request System - Backend](https://github.com/PauloXedric/LateAndAbsenceRequestSystem-frontend) (ASP.NET Core 9). All authentication, request processing, and admin logic are handled via secure API calls.


---

## Author

**Paulo Xedric Lozano**  
GitHub: [@PauloXedric](https://github.com/PauloXedric)  
100% Designed, built, and maintained by me.



