# CampusConnect - Full Stack Campus Placement Portal

A complete full-stack web application for managing campus internships and placements. Built with React.js for the frontend and Node.js/Express for the backend.

## Project Structure

```
internbridge/
├── server.js                 # Backend entry point
├── .env                      # Environment variables
├── .gitignore               # Git ignore file
├── package.json             # Backend dependencies
├── models/                  # MongoDB models
│   ├── User.js
│   ├── Company.js
│   ├── Application.js
│   ├── Interview.js
│   ├── FeedbackLog.js
│   └── Certificate.js
├── routes/                  # API routes
│   ├── auth.js
│   ├── students.js
│   ├── companies.js
│   ├── applications.js
│   ├── interviews.js
│   └── feedback.js
├── middleware/              # Authentication middleware
│   └── auth.js
├── utils/                   # Utility functions
│   ├── recommend.js         # Recommendation engine
│   └── generateCert.js      # Certificate generation
├── uploads/                 # File storage for resumes
└── frontend/                # React frontend
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── index.js
    │   ├── App.js
    │   ├── utils/
    │   │   └── api.js       # API client
    │   ├── pages/
    │   │   ├── Landing.jsx
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── student/     # Student dashboard pages
    │   │   ├── mentor/      # Mentor dashboard pages
    │   │   ├── placement/   # Placement cell pages
    │   │   └── recruiter/   # Recruiter pages
    │   ├── components/      # Reusable components
    │   └── styles/
    │       └── global.css
    ├── package.json
    └── .env.local

```

## Tech Stack

### Backend
- **Node.js** with Express.js framework
- **MongoDB Atlas** with Mongoose
- **bcryptjs** for password hashing
- **jsonwebtoken** for JWT authentication
- **multer** for file uploads
- **pdfkit** for certificate generation
- **CORS** for cross-origin requests

### Frontend
- **React.js** 18+
- **React Router** v6 for navigation
- **CSS Modules** and Global CSS
- **Google Fonts** (DM Sans, Space Grotesk)

## Setup Instructions

### Prerequisites
- Node.js (v14+)
- npm or yarn
- MongoDB Atlas account

### Step 1: Backend Setup

1. Navigate to the project root:
   ```bash
   cd internbridge
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables in `.env`:
   ```
   MONGO_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_long_random_secret_key
   PORT=5000
   ```

4. Start the backend server:
   ```bash
   npm run dev
   ```
   The backend will run at `http://localhost:5000`

### Step 2: Frontend Setup

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure `.env.local`:
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```

4. Start the frontend development server:
   ```bash
   npm start
   ```
   The frontend will run at `http://localhost:3000`

## Features

### For Students
- Browse company opportunities
- AI-powered personalized job recommendations
- Apply to companies with mentor approval workflow
- View applications and track status
- View interview calendar
- Download certificates
- Manage profile and upload resume
- Track employability score across 4 dimensions

### For Mentors
- Review pending student applications
- Approve/reject applications
- Provide feedback on student internships
- Auto-certificate generation upon feedback completion
- View mentored students

### For Placement Cell
- Post new company opportunities
- Manage all students
- Track placement statistics by branch
- View top recruiters
- Send nudges to unplaced students

### For Recruiters
- Search students with multiple filters
- View recruitment pipeline
- Track profiles viewed and shortlisted
- Maintain access audit log

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Students
- `GET /api/students/me` - Get profile
- `PUT /api/students/me` - Update profile
- `POST /api/students/upload-resume` - Upload resume

### Companies
- `GET /api/companies` - Get all open/verified companies
- `GET /api/companies/recommended` - Get AI-recommended companies
- `POST /api/companies` - Post new company (placement_cell only)
- `GET /api/companies/stats` - Get placement statistics

### Applications
- `POST /api/applications/:companyId` - Apply to company
- `GET /api/applications/mine` - Get my applications
- `GET /api/applications/pending-mentor` - Get pending approvals
- `PATCH /api/applications/:id/mentor` - Approve/reject application

### Feedback & Certificates
- `POST /api/feedback` - Submit feedback (auto-creates certificate)
- `GET /api/feedback` - Get feedback/certificates

## Color Palette

- **Primary Blue**: #185FA5
- **Success Green**: #1D9E75
- **Warning Amber**: #BA7517
- **Purple**: #534AB7
- **Danger Red**: #A32D2D
- **Background Off-white**: #F8F9FB
- **Card White**: #FFFFFF
- **Text Primary**: #1A1A2E
- **Text Secondary**: #6B7280

## Key Features Implementation

### Recommendation Engine
The recommendation engine (`utils/recommend.js`) scores companies based on:
- Skills match (50 points)
- CGPA eligibility (20 points)
- Branch eligibility (20 points)
- Placement potential (10 points)

Returns top 10 recommendations with score breakdown.

### Certificate Generation
When mentor completes feedback with `isComplete: true`:
1. Certificate document is auto-created
2. PDF is generated using PDFKit
3. Student employability scores are updated
4. Verification code is generated

### Protected Routes
All protected routes require valid JWT token in localStorage. ProtectedRoute component redirects to login if token is missing.

## Deployment

### Backend (Render)
1. Push code to GitHub
2. Create new Web Service on Render
3. Connect GitHub repository
4. Set environment variables
5. Build command: `npm install`
6. Start command: `node server.js`

### Frontend (Vercel)
1. Push code to GitHub
2. Connect GitHub repo to Vercel
3. Set `REACT_APP_API_URL` environment variable
4. Vercel auto-deploys on push

### Custom Domain
1. Set up domain in registrar
2. Add DNS records from Vercel dashboard
3. Configure in Vercel project settings

## Running Tests

Frontend uses React Testing Library. To run tests:
```bash
cd frontend
npm test
```

## Development Workflow

1. Make changes to backend:
   ```bash
   npm run dev
   ```

2. Make changes to frontend:
   ```bash
   cd frontend
   npm start
   ```

3. Frontend Hot Reload is enabled by default

4. Backend uses nodemon for auto-reload

## Database Models

### User
- Stores student, mentor, placement cell, and recruiter information
- Hashed passwords with bcrypt
- Employability score tracking

### Company
- Company details and job specifications
- Verification and open status flags
- Posted by placement cell

### Application
- Links students to companies
- Application status tracking
- Mentor approval workflow

### Interview
- Interview scheduling
- Mode, location, outcome tracking
- Conflict detection

### FeedbackLog
- Student performance feedback
- Auto-triggers certificate creation
- Updates employability scores

### Certificate
- Auto-generated upon feedback completion
- Unique verification codes
- PDF storage

## Error Handling

- All API endpoints return standardized JSON responses
- Error messages are descriptive
- Status codes follow HTTP standards
- Frontend displays user-friendly error messages

## Security Features

- JWT-based authentication with 7-day expiry
- bcrypt password hashing (10 salt rounds)
- Role-based access control
- Protected routes with middleware
- CORS configured for allowed origins
- Input validation on forms
- Unique compound index on Application (studentId + companyId)

## Performance Optimizations

- Lazy loading of components
- Optimized MongoDB queries with pagination
- Static file serving for uploads
- CSS optimization with utility-first approach
- Recommendation engine caches company list

## Troubleshooting

### MongoDB Connection Error
- Verify connection string in .env
- Check IP whitelist in MongoDB Atlas
- Ensure credentials are correct

### CORS Errors
- Verify frontend URL is in CORS whitelist
- Check both frontend and backend are running
- Ensure API_URL env var is correct

### Token Expired
- User must login again
- Token expiry is set to 7 days
- Logout clears localStorage

### File Upload Issues
- Check uploads folder exists
- Verify multer configuration
- Ensure file permissions are correct

## Future Enhancements

- Email notifications for applications
- Video interview scheduling
- Advanced analytics dashboard
- Resume parsing with AI
- Multiple language support
- Mobile app (React Native)
- Direct messaging between recruiter and student
- Skill endorsement system

## Contributing

1. Create a feature branch
2. Make your changes
3. Commit with descriptive messages
4. Push to GitHub
5. Create Pull Request

## License

ISC License - Feel free to use this project

## Support

For issues and questions, please create an issue on the GitHub repository.

---

**Built for Smart India Hackathon**

**Author**: [Your Name/Organization]
**Last Updated**: March 2024
