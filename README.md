# HESU Procurement Tracker

A comprehensive procurement tracking system for HESU Limited that manages the entire procurement process from request creation to delivery.

## Features

### 🎯 Core Functionality
- **Request Creation**: Users can create detailed procurement requests with item specifications, justifications, and priority levels
- **Real-time Tracking**: Track requests through all stages of the procurement process
- **Role-based Access**: Different interfaces for different user types
- **Public Tracking**: Public page for tracking requests using requisition numbers
- **Mobile Responsive**: Fully responsive design for all devices

### 👥 User Roles
1. **Request Initiator**: Creates and tracks their own requests
2. **Procurement Manager**: Manages officers and oversees all requests
3. **Procurement Officer**: Processes assigned requests and updates status
4. **General User**: Tracks their requests and views status

### 📋 Procurement Process Stages
1. **Create Item Request** - User creates request with details
2. **Forward Request to Procurement** - Automatically sent to procurement manager
3. **Product Sourcing** - Officer looks for suppliers
4. **Create PO** - Purchase order created with PO number
5. **Finance Manager Approval** - PO sent for financial approval
6. **MD Approval** - Managing Director approval required
7. **PO Payment** - Payment processing
8. **Delivery** - Awaiting goods delivery
9. **Completed** - Request marked as closed

## Demo Instructions

### Getting Started
1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```

3. **Open Browser**: Navigate to `http://localhost:3000`

### Demo Users
The system includes pre-configured demo users for testing different roles:

| Name | Email | Role | Department |
|------|-------|------|------------|
| John Doe | john.doe@hesu.com | Request Initiator | IT Department |
| Sarah Johnson | sarah.johnson@hesu.com | Procurement Manager | Procurement |
| Mike Wilson | mike.wilson@hesu.com | Procurement Officer | Procurement |
| Lisa Brown | lisa.brown@hesu.com | Procurement Officer | Procurement |
| David Smith | david.smith@hesu.com | General User | Finance Department |

**Password for all demo users**: `demo123`

### Demo Scenarios

#### 1. Request Initiator Workflow
1. Login as John Doe (john.doe@hesu.com)
2. Click "Create New Request"
3. Fill out the request form with item details
4. Submit the request
5. View the generated requisition number
6. Track the request status

#### 2. Procurement Manager Workflow
1. Login as Sarah Johnson (sarah.johnson@hesu.com)
2. View "All Requests" to see all pending requests
3. Go to "Manage Officers" to view officer performance
4. Assign requests to procurement officers

#### 3. Procurement Officer Workflow
1. Login as Mike Wilson (mike.wilson@hesu.com)
2. View "All Requests" to see assigned requests
3. Update request status through different stages
4. Add notes and tracking information

#### 4. Public Tracking
1. Go to `/track` (no login required)
2. Use demo requisition numbers:
   - (Product Sourcing)
   - REQ-2024-002 (Finance Approval)
   - REQ-2024-003 (Delivery)
   - REQ-2024-004 (Completed)
3. View detailed tracking information

### Demo Data
The system includes sample requests with different statuses:
- **REQ-2024-001**: Laptop Computer - Currently in Product Sourcing
- **REQ-2024-002**: Office Chairs - Awaiting Finance Approval
- **REQ-2024-003**: Projector - Awaiting Delivery
- **REQ-2024-004**: Printer - Completed

## Technical Stack

- **Frontend**: Next.js 15, React 19
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Authentication**: Client-side with localStorage
- **State Management**: React Context API

## Project Structure

```
app/
├── components/          # Reusable UI components
│   ├── ui/             # Basic UI components (Button, Input, Card, etc.)
│   ├── Navigation.js   # Main navigation component
│   ├── StatusTracker.js # Request status tracking component
│   └── ProtectedRoute.js # Route protection wrapper
├── contexts/           # React contexts
│   └── AuthContext.js  # Authentication context
├── data/              # Mock data and constants
│   └── mockData.js    # Sample data for demo
├── login/             # Login page
├── dashboard/         # Main dashboard
├── create-request/    # Request creation page
├── my-requests/       # User's requests page
├── all-requests/      # All requests (officers/managers)
├── manage-officers/   # Officer management (managers)
├── track/             # Public tracking page
└── request/[id]/      # Individual request details
```

## Key Features Demonstrated

### 🎨 UI/UX
- Clean, modern interface with Tailwind CSS
- Mobile-responsive design
- Intuitive navigation
- Status indicators and progress tracking
- Real-time updates simulation

### 🔐 Authentication & Authorization
- Role-based access control
- Protected routes
- User session management
- Demo user switching

### 📊 Data Management
- Mock data with realistic scenarios
- Status tracking with history
- Priority levels and categorization
- Search and filtering capabilities

### 📱 Mobile Responsiveness
- Responsive grid layouts
- Mobile-friendly navigation
- Touch-optimized interactions
- Adaptive typography and spacing

## Future Enhancements

- Backend API integration
- Real-time notifications
- Email notifications
- File uploads for attachments
- Advanced reporting and analytics
- Multi-language support
- Audit trail logging

## Contact

For questions about this demo or the procurement tracking system, please contact the development team.

---

**Note**: This is a frontend-only demo with mock data. In a production environment, this would be connected to a backend API and database.