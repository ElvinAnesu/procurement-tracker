// Mock data for the procurement tracker system

export const USER_ROLES = {
  REQUEST_INITIATOR: 'request_initiator',
  PROCUREMENT_MANAGER: 'procurement_manager',
  PROCUREMENT_OFFICER: 'procurement_officer',
  GENERAL_USER: 'general_user'
};

export const REQUEST_STATUS = {
  PENDING: 'pending',
  ASSIGNED: 'assigned',
  PRODUCT_SOURCING: 'product_sourcing',
  CREATE_PO: 'create_po',
  FINANCE_APPROVAL: 'finance_approval',
  MD_APPROVAL: 'md_approval',
  PO_PAYMENT: 'po_payment',
  DELIVERY: 'delivery',
  COMPLETED: 'completed',
  DECLINED: 'declined',
  CANCELLED: 'cancelled'
};

export const PRIORITY_LEVELS = {
  URGENT: 'urgent',
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low'
};

export const DEPARTMENTS = [
  'IT Department',
  'Finance Department',
  'Human Resources',
  'Operations',
  'Marketing',
  'Sales',
  'Administration',
  'Legal',
  'Customer Service'
];

export const mockUsers = [
  {
    id: '1',
    name: 'Elvin Kakomo',
    email: 'elvin.kakomo@hesu.co.tz',
    role: USER_ROLES.REQUEST_INITIATOR,
    department: 'IT Department',
    avatar: null
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@hesu.com',
    role: USER_ROLES.PROCUREMENT_MANAGER,
    department: 'Procurement',
    avatar: null
  },
  {
    id: '3',
    name: 'Mike Wilson',
    email: 'mike.wilson@hesu.com',
    role: USER_ROLES.PROCUREMENT_OFFICER,
    department: 'Procurement',
    avatar: null
  },
  {
    id: '4',
    name: 'Lisa Brown',
    email: 'lisa.brown@hesu.com',
    role: USER_ROLES.PROCUREMENT_OFFICER,
    department: 'Procurement',
    avatar: null
  },
  {
    id: '5',
    name: 'Norah Norasco',
    email: 'norah.norasco@hesu.co.tz',
    role: USER_ROLES.GENERAL_USER,
    department: 'Finance Department',
    avatar: null
  }
];

export const mockRequests = [
  {
    id: '1',
    requisitionNumber: 'REQ-2024-001',
    itemRequested: 'Laptop Computer - Dell Latitude 5520',
    requesterName: 'Norah Norasco',
    requesterEmail: 'norah.norasco@hesu.co.tz',
    department: 'IT Department',
    purpose: 'Replace outdated laptop for software development',
    priority: PRIORITY_LEVELS.HIGH,
    status: REQUEST_STATUS.PRODUCT_SOURCING,
    assignedOfficer: 'Ibrahim Msambwe',
    assignedOfficerEmail: 'ibrahim.msambwe@hesu.co.tz',
    poNumber: null,
    createdAt: '2024-01-15T09:00:00Z',
    updatedAt: '2024-01-16T14:30:00Z',
    estimatedDelivery: '2024-02-15T00:00:00Z',
    trackingHistory: [
      {
        stage: REQUEST_STATUS.PENDING,
        timestamp: '2024-01-15T09:00:00Z',
        note: 'Request created and submitted',
        updatedBy: 'Elvin Kakomo'
      },
      {
        stage: REQUEST_STATUS.ASSIGNED,
        timestamp: '2024-01-15T10:30:00Z',
        note: 'Assigned to Mike Wilson',
        updatedBy: 'Ibrahim Msambwe'
      },
      // {
      //   stage: REQUEST_STATUS.PRODUCT_SOURCING,
      //   timestamp: '2024-01-16T14:30:00Z',
      //   note: 'Currently sourcing suppliers for Dell Latitude 5520',
      //   updatedBy: 'Mike Wilson'
      // }
    ]
  },
  {
    id: '2',
    requisitionNumber: 'REQ-2024-002',
    itemRequested: 'Office Chairs - Ergonomic',
    requesterName: 'David Smith',
    requesterEmail: 'david.smith@hesu.com',
    department: 'Finance Department',
    purpose: 'Replace old office chairs for better ergonomics',
    priority: PRIORITY_LEVELS.MEDIUM,
    status: REQUEST_STATUS.FINANCE_APPROVAL,
    assignedOfficer: 'Lisa Brown',
    assignedOfficerEmail: 'lisa.brown@hesu.com',
    poNumber: 'PO-2024-015',
    createdAt: '2024-01-10T08:00:00Z',
    updatedAt: '2024-01-18T11:00:00Z',
    estimatedDelivery: '2024-02-20T00:00:00Z',
    trackingHistory: [
      {
        stage: REQUEST_STATUS.PENDING,
        timestamp: '2024-01-10T08:00:00Z',
        note: 'Request created and submitted',
        updatedBy: 'David Smith'
      },
      {
        stage: REQUEST_STATUS.ASSIGNED,
        timestamp: '2024-01-10T09:15:00Z',
        note: 'Assigned to Lisa Brown',
        updatedBy: 'Sarah Johnson'
      },
      {
        stage: REQUEST_STATUS.PRODUCT_SOURCING,
        timestamp: '2024-01-12T10:00:00Z',
        note: 'Sourcing ergonomic office chairs from multiple suppliers',
        updatedBy: 'Lisa Brown'
      },
      {
        stage: REQUEST_STATUS.CREATE_PO,
        timestamp: '2024-01-15T14:20:00Z',
        note: 'Purchase Order PO-2024-015 created with Office Solutions Ltd',
        updatedBy: 'Lisa Brown'
      },
      {
        stage: REQUEST_STATUS.FINANCE_APPROVAL,
        timestamp: '2024-01-18T11:00:00Z',
        note: 'PO submitted for finance manager approval',
        updatedBy: 'Lisa Brown'
      }
    ]
  },
  {
    id: '3',
    requisitionNumber: 'REQ-2024-003',
    itemRequested: 'Projector - 4K Ultra HD',
    requesterName: 'John Doe',
    requesterEmail: 'john.doe@hesu.com',
    department: 'IT Department',
    purpose: 'For conference room presentations',
    priority: PRIORITY_LEVELS.URGENT,
    status: REQUEST_STATUS.DELIVERY,
    assignedOfficer: 'Mike Wilson',
    assignedOfficerEmail: 'mike.wilson@hesu.com',
    poNumber: 'PO-2024-008',
    createdAt: '2024-01-05T07:00:00Z',
    updatedAt: '2024-01-20T16:45:00Z',
    estimatedDelivery: '2024-01-25T00:00:00Z',
    trackingHistory: [
      {
        stage: REQUEST_STATUS.PENDING,
        timestamp: '2024-01-05T07:00:00Z',
        note: 'Request created and submitted',
        updatedBy: 'John Doe'
      },
      {
        stage: REQUEST_STATUS.ASSIGNED,
        timestamp: '2024-01-05T08:30:00Z',
        note: 'Assigned to Mike Wilson',
        updatedBy: 'Sarah Johnson'
      },
      {
        stage: REQUEST_STATUS.PRODUCT_SOURCING,
        timestamp: '2024-01-06T09:00:00Z',
        note: 'Researching 4K projectors from various suppliers',
        updatedBy: 'Mike Wilson'
      },
      {
        stage: REQUEST_STATUS.CREATE_PO,
        timestamp: '2024-01-08T11:15:00Z',
        note: 'Purchase Order PO-2024-008 created with Tech Solutions Inc',
        updatedBy: 'Mike Wilson'
      },
      {
        stage: REQUEST_STATUS.FINANCE_APPROVAL,
        timestamp: '2024-01-10T14:00:00Z',
        note: 'PO approved by Finance Manager',
        updatedBy: 'Finance Manager'
      },
      {
        stage: REQUEST_STATUS.MD_APPROVAL,
        timestamp: '2024-01-12T16:30:00Z',
        note: 'PO approved by Managing Director',
        updatedBy: 'Managing Director'
      },
      {
        stage: REQUEST_STATUS.PO_PAYMENT,
        timestamp: '2024-01-15T10:00:00Z',
        note: 'Payment processed successfully',
        updatedBy: 'Finance Team'
      },
      {
        stage: REQUEST_STATUS.DELIVERY,
        timestamp: '2024-01-20T16:45:00Z',
        note: 'Goods dispatched, expected delivery in 5 days',
        updatedBy: 'Mike Wilson'
      }
    ]
  },
  {
    id: '4',
    requisitionNumber: 'REQ-2024-004',
    itemRequested: 'Printer - HP LaserJet Pro',
    requesterName: 'David Smith',
    requesterEmail: 'david.smith@hesu.com',
    department: 'Finance Department',
    purpose: 'Replace broken printer in finance office',
    priority: PRIORITY_LEVELS.HIGH,
    status: REQUEST_STATUS.COMPLETED,
    assignedOfficer: 'Lisa Brown',
    assignedOfficerEmail: 'lisa.brown@hesu.com',
    poNumber: 'PO-2024-012',
    createdAt: '2023-12-20T10:00:00Z',
    updatedAt: '2024-01-10T15:30:00Z',
    estimatedDelivery: '2024-01-10T00:00:00Z',
    trackingHistory: [
      {
        stage: REQUEST_STATUS.PENDING,
        timestamp: '2023-12-20T10:00:00Z',
        note: 'Request created and submitted',
        updatedBy: 'David Smith'
      },
      {
        stage: REQUEST_STATUS.ASSIGNED,
        timestamp: '2023-12-20T11:00:00Z',
        note: 'Assigned to Lisa Brown',
        updatedBy: 'Sarah Johnson'
      },
      {
        stage: REQUEST_STATUS.PRODUCT_SOURCING,
        timestamp: '2023-12-22T09:00:00Z',
        note: 'Evaluating HP LaserJet Pro models',
        updatedBy: 'Lisa Brown'
      },
      {
        stage: REQUEST_STATUS.CREATE_PO,
        timestamp: '2023-12-28T14:00:00Z',
        note: 'Purchase Order PO-2024-012 created',
        updatedBy: 'Lisa Brown'
      },
      {
        stage: REQUEST_STATUS.FINANCE_APPROVAL,
        timestamp: '2024-01-02T10:30:00Z',
        note: 'PO approved by Finance Manager',
        updatedBy: 'Finance Manager'
      },
      {
        stage: REQUEST_STATUS.MD_APPROVAL,
        timestamp: '2024-01-04T15:00:00Z',
        note: 'PO approved by Managing Director',
        updatedBy: 'Managing Director'
      },
      {
        stage: REQUEST_STATUS.PO_PAYMENT,
        timestamp: '2024-01-06T11:00:00Z',
        note: 'Payment processed',
        updatedBy: 'Finance Team'
      },
      {
        stage: REQUEST_STATUS.DELIVERY,
        timestamp: '2024-01-08T14:00:00Z',
        note: 'Goods delivered to finance office',
        updatedBy: 'Lisa Brown'
      },
      {
        stage: REQUEST_STATUS.COMPLETED,
        timestamp: '2024-01-10T15:30:00Z',
        note: 'Request completed successfully',
        updatedBy: 'Lisa Brown'
      }
    ]
  }
];

export const getStatusDisplayInfo = (status) => {
  const statusMap = {
    [REQUEST_STATUS.PENDING]: { label: 'Pending Assignment', color: 'bg-yellow-100 text-yellow-800', icon: 'Clock' },
    [REQUEST_STATUS.ASSIGNED]: { label: 'Assigned to Officer', color: 'bg-blue-100 text-blue-800', icon: 'UserCheck' },
    [REQUEST_STATUS.PRODUCT_SOURCING]: { label: 'Product Sourcing', color: 'bg-purple-100 text-purple-800', icon: 'Search' },
    [REQUEST_STATUS.CREATE_PO]: { label: 'Purchase Order Created', color: 'bg-indigo-100 text-indigo-800', icon: 'FileText' },
    [REQUEST_STATUS.FINANCE_APPROVAL]: { label: 'Finance Approval', color: 'bg-orange-100 text-orange-800', icon: 'DollarSign' },
    [REQUEST_STATUS.MD_APPROVAL]: { label: 'MD Approval', color: 'bg-red-100 text-red-800', icon: 'Shield' },
    [REQUEST_STATUS.PO_PAYMENT]: { label: 'Payment Processing', color: 'bg-green-100 text-green-800', icon: 'CreditCard' },
    [REQUEST_STATUS.DELIVERY]: { label: 'Awaiting Delivery', color: 'bg-teal-100 text-teal-800', icon: 'Truck' },
    [REQUEST_STATUS.COMPLETED]: { label: 'Completed', color: 'bg-green-100 text-green-800', icon: 'CheckCircle' },
    [REQUEST_STATUS.DECLINED]: { label: 'Declined', color: 'bg-red-100 text-red-800', icon: 'XCircle' },
    [REQUEST_STATUS.CANCELLED]: { label: 'Cancelled', color: 'bg-gray-100 text-gray-800', icon: 'X' }
  };
  
  return statusMap[status] || { label: status, color: 'bg-gray-100 text-gray-800', icon: 'HelpCircle' };
};

export const getPriorityDisplayInfo = (priority) => {
  const priorityMap = {
    [PRIORITY_LEVELS.URGENT]: { label: 'Urgent', color: 'bg-red-100 text-red-800', icon: 'AlertTriangle' },
    [PRIORITY_LEVELS.HIGH]: { label: 'High', color: 'bg-orange-100 text-orange-800', icon: 'ArrowUp' },
    [PRIORITY_LEVELS.MEDIUM]: { label: 'Medium', color: 'bg-yellow-100 text-yellow-800', icon: 'Minus' },
    [PRIORITY_LEVELS.LOW]: { label: 'Low', color: 'bg-green-100 text-green-800', icon: 'ArrowDown' }
  };
  
  return priorityMap[priority] || { label: priority, color: 'bg-gray-100 text-gray-800', icon: 'HelpCircle' };
};
