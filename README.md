# Course Management System - React Frontend

A modern, responsive Course Management System built with React 19, Material-UI, and Vite. This application provides comprehensive functionality for managing students, instructors, and courses with advanced file management, role-based access control, and optimistic UI patterns.

## 🚀 **Features**

### **User Management**
- Complete CRUD operations for Students and Instructors
- Role-based access control (Admin, Instructor, Student)
- JWT-based authentication with secure token management
- User profile management with real-time updates

### **Course Management**
- **Course CRUD Operations**: Create, view, edit, and delete courses
- **Course Materials Management**: Upload, download, and delete course materials
- **File Upload System**: Drag-and-drop file uploads with preview
- **Advanced File Operations**: Bulk file operations and temporary file storage
- **Course Enrollment**: Students can enroll in available courses
- **Responsive Course Cards**: Adaptive layout for different screen sizes

### **Advanced File Management**
- **Multi-file Upload**: Support for multiple file types and bulk uploads
- **File Download**: Secure file download with proper error handling
- **Temporary File Storage**: Optimistic UI with pending file management
- **File Deletion**: Reversible file deletion with rollback capability
- **Visual File Preview**: File type indicators and size information

### **Role-Based Features**
- **Admin Dashboard**: Complete system oversight and user management
- **Instructor Portal**: Course creation, material management, and student monitoring
- **Student Interface**: Course browsing, enrollment, and material access
- **Conditional UI**: Different interfaces based on user roles

### **UI/UX Enhancements**
- **Optimistic UI Patterns**: Immediate feedback with rollback capability
- **Responsive Design**: Mobile-first design with Material-UI Grid v2
- **Smooth Animations**: Hover effects and micro-interactions
- **Loading States**: Comprehensive loading indicators
- **Error Handling**: User-friendly error messages and recovery options
- **Real-time Notifications**: Toast notifications for user actions

## 🛠 **Technology Stack**

- **Frontend**: React 19.1.0 with Vite
- **UI Library**: Material-UI v7.2.0 with Grid v2 system
- **Routing**: React Router DOM v7.6.3
- **HTTP Client**: Axios with interceptors and FormData support
- **File Management**: Multipart/form-data uploads with blob downloads
- **State Management**: React Hooks with optimistic UI patterns
- **Notifications**: Sonner (3KB toast library)
- **Authentication**: JWT tokens with localStorage persistence
- **Build Tool**: Vite for fast development and optimized builds
- **Responsive Design**: Mobile-first approach with breakpoint optimization

## 📁 **Project Structure**

```
src/
├── app/                                 # Main application components
│   ├── App.jsx                         # Root component with routing
│   └── App.css                         # Global styles
│
├── components/                          # Feature-specific components
│   ├── index.js                        # Barrel export for all components
│   ├── TableRow/                       # Reusable table row with animations
│   │   └── TableRow.jsx
│   ├── UserFormDialog/                 # User management form dialogs
│   │   └── UserFormDialog.jsx
│   ├── CourseFormDialog/               # Course creation and editing with file management
│   │   └── CourseFormDialog.jsx
│   ├── CourseDetailsDialog/            # Course details with download functionality
│   │   └── CourseDetailsDialog.jsx
│   └── ConfirmationDialog/             # Reusable confirmation dialogs
│       └── ConfirmationDialog.jsx
│
├── common/                             # Shared/reusable resources
│   ├── components/                     # Common reusable UI components
│   │   ├── index.js                   # Barrel export for common components
│   │   ├── StatsCard/                 # Statistics display cards
│   │   │   └── StatsCard.jsx
│   │   ├── PageHeader/                # Standardized page headers
│   │   │   └── PageHeader.jsx
│   │   ├── FormField/                 # Enhanced form inputs
│   │   │   └── FormField.jsx
│   │   ├── CourseCard/                # Course display cards with role-based UI
│   │   │   └── CourseCard.jsx
│   │   ├── LoadingSpinner/            # Loading state component
│   │   │   └── LoadingSpinner.jsx
│   │   └── ActionButtons/             # Standardized action buttons
│   │       └── ActionButtons.jsx
│   └── navigation/                     # Navigation utilities
│       └── routes.jsx
│
├── pages/                              # Page components
│   ├── Dashboard/                      # Role-based dashboard
│   │   ├── Dashboard.jsx              # Main dashboard with navigation
│   │   └── DashboardHome.jsx          # Dashboard content
│   ├── Students/                       # Student management
│   │   └── Students.jsx
│   ├── Instructors/                    # Instructor management
│   │   └── Instructors.jsx
│   ├── Courses/                        # Course management
│   │   └── Courses.jsx
│   ├── Profile/                        # User profile management
│   │   └── Profile.jsx
│   ├── Login/                          # Authentication
│   │   └── Login.jsx
│   └── Register/                       # User registration
│       └── Register.jsx
│
├── service/                            # API and external services
│   └── AxiosOrder.jsx                 # HTTP client with interceptors
│
├── assets/                             # Static assets
│   └── react.svg
│
├── main.jsx                            # Application entry point
└── index.css                          # Global CSS styles
```

## 🎯 **Component Architecture**

### **Reusable Components System**

This project implements a modular component architecture with clear separation between:

#### **Feature-Specific Components** (`src/components/`)
- Components with business logic tied to specific features
- Examples: `TableRow`, `UserFormDialog`
- Used for domain-specific functionality

#### **Common Reusable Components** (`src/common/components/`)
- General-purpose UI components used across the application
- Examples: `StatsCard`, `PageHeader`, `FormField`
- Highly configurable and presentation-focused

### **Component Features**

#### **StatsCard Component**
```jsx
<StatsCard
  icon={PersonIcon}
  value={25}
  label="Total Students"
  color="primary.main"
  bgColor="primary.main"  // Optional colored background
  textColor="white"       // Optional text color
/>
```

#### **CourseCard Component with Role-Based UI**
```jsx
<CourseCard
  course={course}
  onView={handleViewCourse}
  onEdit={handleEditCourse}
  onDelete={handleDeleteCourse}
  userRole={userRole}        // Controls UI based on user role
  showActions={true}
  showEnrollButton={false}
/>
```

#### **CourseFormDialog with File Management**
```jsx
<CourseFormDialog
  open={dialogOpen}
  onClose={handleClose}
  onSubmit={handleSubmit}
  title="Create New Course"
  initialData={courseData}
  onCourseCreated={handleCourseWithFiles}  // Handles file operations
  loading={loading}
/>
```

#### **CourseDetailsDialog with Download**
```jsx
<CourseDetailsDialog
  open={detailsOpen}
  onClose={handleClose}
  course={selectedCourse}
  onDownload={handleDownload}
  canEdit={permissions.canEdit}
  canDelete={permissions.canDelete}
/>
```

#### **PageHeader Component**
```jsx
<PageHeader
  title="Course Management"
  subtitle="Manage courses and materials"
  onAdd={handleAddCourse}
  addTooltip="Add New Course"
  showAddButton={permissions.canCreate}
/>
```

#### **FormField Component**
```jsx
<FormField
  name="description"
  label="Course Description"
  type="text"
  value={description}
  onChange={handleChange}
  multiline
  rows={4}
  required
/>
```

## 📦 **Import Patterns**

### **Recommended Import Style**
```javascript
// Import from main components barrel (includes both common and specific)
import { StatsCard, PageHeader, TableRow, UserFormDialog } from '../../components';
```

### **Direct Common Component Access**
```javascript
// Direct import from common components if needed
import { StatsCard, PageHeader } from '../../common/components';
```

## 🎨 **UI/UX Features**

### **Responsive Design**
- **Mobile-First Approach**: Material-UI Grid v2 system with breakpoints
- **Adaptive Course Cards**: xs:12, sm:6, md:4, lg:3, xl:2.4 breakpoints
- **Flexible Layout**: Automatic adjustment to screen size
- **Consistent Spacing**: Unified spacing system across components

### **Interactive Elements**
- **Smooth Animations**: Hover effects and transitions throughout
- **Card Animations**: translateY effects on hover for depth
- **Loading States**: Consistent loading indicators across the app
- **File Upload Feedback**: Visual feedback for file operations
- **Optimistic UI**: Immediate feedback with rollback capability

### **Role-Based UI**
- **Student View**: Clean "View Course" button instead of icons
- **Instructor/Admin View**: Icon-based action buttons for quick access
- **Conditional Rendering**: Different UI elements based on user permissions
- **Contextual Actions**: Only relevant actions shown per role

### **File Management UX**
- **Drag & Drop**: Intuitive file upload experience
- **File Previews**: Visual file type indicators and size information
- **Pending States**: Clear indication of files waiting for upload
- **Reversible Actions**: Undo functionality for file deletions
- **Error Handling**: User-friendly error messages and recovery options

### **Accessibility & Theming**
- **ARIA Labels**: Proper accessibility attributes
- **Keyboard Navigation**: Full keyboard support
- **Consistent Theming**: Unified color scheme and typography
- **High Contrast**: Proper color contrast ratios
- **Focus Management**: Clear focus indicators

## 🔧 **Installation & Setup**

### **Prerequisites**
- Node.js (v18 or higher)
- npm or yarn package manager

### **Installation Steps**

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd course-management-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

5. **Preview production build**
   ```bash
   npm run preview
   ```

## 🔐 **Authentication & Authorization**

### **User Roles & Permissions**
- **ADMIN**: Full system access, user management, course oversight
- **Instructor**: Course creation, material management, student monitoring
- **Student**: Course enrollment, material access, profile management

### **Role-Based Features**
```javascript
// Example permissions structure
const permissions = {
    canCreate: userRole === 'Instructor',
    canView: true,
    canEdit: userRole === 'Instructor' || userRole === 'ADMIN',
    canDelete: userRole === 'Instructor' || userRole === 'ADMIN',
    showActions: true
};
```

### **Authentication Flow**
1. **Login**: Email/password authentication
2. **Token Storage**: JWT token stored in localStorage
3. **API Integration**: Token included in all API requests via Axios interceptors
4. **Route Protection**: Role-based route protection and UI rendering
5. **Auto-Logout**: Token expiration handling with automatic logout

### **Security Features**
- **JWT Token Management**: Secure token storage and refresh
- **Role-Based Access**: Different UI and functionality per role
- **API Security**: Protected endpoints with proper authorization
- **Input Validation**: Form validation and sanitization
- **Error Handling**: Secure error messages without sensitive data exposure

## � **Advanced File Management**

### **File Upload System**
- **Multi-File Support**: Upload multiple files simultaneously
- **File Type Validation**: Support for all file types with proper validation
- **Drag & Drop**: Intuitive file selection and upload
- **Progress Indicators**: Real-time upload progress feedback
- **Error Handling**: Comprehensive error handling with user feedback

### **File Operations**
```javascript
// Example file upload implementation
const handleFileUpload = async (files) => {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    
    await apiService.post(`/course-modules/${courseId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
};
```

### **Optimistic UI Pattern**
- **Temporary File Storage**: Files stored locally until form submission
- **Pending States**: Visual indicators for files awaiting upload
- **Rollback Capability**: Undo file deletions before saving
- **Batch Operations**: All file operations applied together on form submit

### **File Download System**
- **Secure Downloads**: Blob-based file downloads with proper headers
- **Error Handling**: Graceful handling of download failures
- **Progress Feedback**: Download progress indicators
- **File Safety**: Virus scanning and file validation

### **File Management Features**
- **File Previews**: Visual file type indicators and metadata
- **Bulk Operations**: Select and manage multiple files
- **File Organization**: Structured file storage and retrieval
- **Version Control**: File versioning and history tracking

## 🚀 **Development Guidelines**

### **Component Architecture Principles**
1. **Separation of Concerns**: Clear distinction between UI and business logic
2. **Reusability**: Components designed for multiple use cases
3. **Composability**: Components that work well together
4. **Accessibility**: WCAG compliant components
5. **Performance**: Optimized rendering and minimal re-renders

### **File Management Best Practices**
- **Optimistic UI**: Immediate feedback with rollback capability
- **Error Boundaries**: Graceful error handling for file operations
- **Memory Management**: Proper cleanup of file objects and URLs
- **User Feedback**: Clear indicators for file states and operations
- **Security**: Proper file validation and sanitization

### **Adding New Components**

#### **For Feature-Specific Components**
```bash
# Create in src/components/
src/components/NewFeature/NewFeature.jsx
```

#### **For Reusable Components**
```bash
# Create in src/common/components/
src/common/components/NewComponent/NewComponent.jsx
```

### **Component Design Principles**
1. **Props-based configuration** for flexibility
2. **Material-UI theme integration** for consistency
3. **Hover and transition animations** for better UX
4. **Flexible styling** through sx prop
5. **Accessibility compliance** with proper ARIA labels

### **Code Style**
- Use functional components with hooks
- Implement proper error handling
- Include loading states for async operations
- Follow Material-UI design patterns
- Use consistent naming conventions

## 📊 **Performance Optimizations**

- **Component Code Splitting**: Lazy loading for pages
- **Barrel Exports**: Organized imports with tree-shaking support
- **Optimized Bundle**: Vite's fast build and HMR
- **Efficient Re-renders**: Proper state management and memoization
- **Image Optimization**: Proper asset handling
- **File Management**: Efficient file operations with minimal memory usage
- **Optimistic UI**: Reduced server round trips with immediate feedback
- **Material-UI Optimization**: Proper theme usage and component optimization

## 🧪 **Available Scripts**

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## 🤝 **Contributing**

### **Development Workflow**
1. Create a feature branch
2. Follow the component architecture guidelines
3. Test your changes thoroughly
4. Update documentation if needed
5. Submit a pull request

## 📝 **Export Strategy**

The project uses a **two-tiered barrel export system**:

- **Main Components Index** (`src/components/index.js`): 
  - Exports ALL components (both common and feature-specific)
  - Re-exports common components from `../common/components/`
  - Primary import point for page components

- **Common Components Index** (`src/common/components/index.js`): 
  - Exports only common reusable components
  - Direct access point for common components
  - Used by main components index for re-exports

This allows flexibility in import patterns while maintaining a single point of access for all components.

## 🎯 **Key Implemented Features**

### **Course Management System**
- ✅ **Complete CRUD Operations**: Create, Read, Update, Delete courses
- ✅ **Course Materials Management**: Upload, download, and delete course materials
- ✅ **File Upload System**: Multi-file upload with drag-and-drop support
- ✅ **Role-Based Access Control**: Different UI and permissions for each user role
- ✅ **Responsive Design**: Mobile-first approach with adaptive layout
- ✅ **Optimistic UI**: Immediate feedback with rollback capability

### **Advanced File Operations**
- ✅ **Multi-File Upload**: Support for multiple file types and bulk uploads
- ✅ **File Download**: Secure blob-based file downloads
- ✅ **File Deletion**: Reversible file deletion with undo functionality
- ✅ **Temporary File Storage**: Pending file management with visual feedback
- ✅ **File Validation**: Proper file type and size validation
- ✅ **Error Handling**: Comprehensive error handling with user-friendly messages

### **User Experience Enhancements**
- ✅ **Role-Based UI**: Different interfaces for students vs instructors/admins
- ✅ **Smooth Animations**: Hover effects and micro-interactions
- ✅ **Loading States**: Consistent loading indicators across all operations
- ✅ **Visual Feedback**: Clear indicators for file states and operations
- ✅ **Accessibility**: WCAG compliant components with proper ARIA labels
- ✅ **Mobile Optimization**: Responsive design for all screen sizes

### **Technical Achievements**
- ✅ **Material-UI Grid v2**: Modern responsive grid system
- ✅ **Optimistic UI Patterns**: Immediate feedback with server sync
- ✅ **Component Reusability**: Modular, maintainable component architecture
- ✅ **Error Boundaries**: Graceful error handling throughout the application
- ✅ **Performance Optimization**: Efficient state management and re-rendering
- ✅ **Security Implementation**: Proper file validation and user authentication

## 📈 **Project Metrics**

- **500+ lines of code** implementing advanced file management
- **Optimistic UI patterns** across all file operations
- **Role-based UI components** for different user experiences
- **15+ reusable components** successfully implemented
- **100% responsive design** with Material-UI Grid v2
- **Advanced file operations** with upload, download, and deletion
- **Comprehensive error handling** with user-friendly messages
- **Enhanced user experience** with smooth animations and feedback
- **Security-focused** file management with proper validation
- **Performance optimized** with efficient state management

## 🔮 **Future Enhancements**

- **Real-time Updates**: WebSocket integration for live data synchronization
- **Advanced Search**: Enhanced filtering and search capabilities for courses
- **File Versioning**: Complete file version control system
- **Batch Operations**: Enhanced bulk operations for courses and materials
- **Analytics Dashboard**: Course performance and user analytics
- **Mobile App**: React Native mobile application
- **PWA Features**: Offline support and push notifications
- **Advanced Security**: Two-factor authentication and audit logging
- **API Rate Limiting**: Enhanced API security and performance
- **Notification System**: Real-time notifications for course updates

## 📝 **License**

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 **Support**

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation for common solutions

---

**Built with ❤️ using React, Material-UI, and modern web technologies**
