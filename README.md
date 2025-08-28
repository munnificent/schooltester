# SchoolTester: Online Educational Platform

SchoolTester is a comprehensive, full-stack web application designed to manage educational processes. It provides a platform for administrators, teachers, and students to interact with courses, lessons, and user management in a modern, role-based environment.

The application is built with a Django backend serving a RESTful API and a React frontend for a dynamic user experience.

## Tech Stack

**Backend:**
- **Python**
- **Django & Django Rest Framework:** For the robust API and backend logic.
- **PostgreSQL:** As the primary database.
- **Simple JWT:** For JSON Web Token authentication.

**Frontend:**
- **React & TypeScript:** For building a type-safe and modern user interface.
- **Vite:** As the build tool for a fast development experience.
- **Tailwind CSS:** For utility-first styling.
- **Axios:** For making API requests.
- **React Router:** For client-side routing.
- **Framer Motion:** For UI animations.

## Key Features

- **Role-Based Access Control:**
    - **Admin:** Full control over the platform, including user management, course creation, and system settings.
    - **Teacher:** Can manage their own courses, view their students, and access a dedicated dashboard with statistics.
    - **Student:** Can enroll in courses, view their schedule, and access their personal dashboard.
- **Comprehensive Dashboards:**
    - **Admin Dashboard:** Global statistics and management tables for all users, courses, and applications.
    - **Teacher Dashboard:** Shows statistics on assigned courses and total students.
    - **Student Dashboard:** Displays enrolled courses and a schedule of upcoming lessons.
- **Course & Lesson Management:** Admins and teachers can create and manage courses and their associated lessons.
- **Student & User Management:** Admins can manage all users, while teachers can view the students enrolled in their courses.
- **Secure Authentication:** Uses JWT for secure and stateless authentication.
- **Responsive UI:** The frontend is designed to work on various screen sizes.

## Getting Started

### Prerequisites

- Python 3.x
- Node.js and npm
- PostgreSQL database

### Backend Setup

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Create a virtual environment and activate it:**
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
    ```

3.  **Install Python dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Configure your database:**
    - Make sure your PostgreSQL server is running.
    - Create a database and a user.
    - Update the `DATABASES` setting in `backend/settings.py` with your credentials.

5.  **Run database migrations:**
    ```bash
    python manage.py migrate
    ```

6.  **Run the backend server:**
    ```bash
    python manage.py runserver
    ```
    The backend API will be available at `http://127.0.0.1:8000`.

### Frontend Setup

1.  **Navigate to the project root directory.**

2.  **Install Node.js dependencies:**
    ```bash
    npm install
    ```

3.  **Run the frontend development server:**
    ```bash
    npm run dev
    ```
    The frontend application will be available at `http://localhost:5173`.

## Project Structure

```
/
├── backend/         # Django project
│   ├── applications/  # Django app for handling requests
│   ├── courses/       # Django app for courses and lessons
│   ├── users/         # Django app for user management
│   └── ...
├── src/             # React project source
│   ├── api/         # API client (axios)
│   ├── components/  # Reusable React components
│   ├── contexts/    # React contexts (e.g., AuthContext)
│   ├── pages/       # Page components for different routes
│   └── types/       # TypeScript type definitions
├── package.json     # Frontend dependencies
└── requirements.txt # Backend dependencies
```
