'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { mockRequests, getStatusDisplayInfo, getPriorityDisplayInfo } from '../data/mockData';
import { 
  Search, 
  Filter, 
  Eye, 
  FileText, 
  Calendar,
  User,
  Building2
} from 'lucide-react';
import Card, { CardHeader, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Badge from '../components/ui/Badge';
import Link from 'next/link';
import { format } from 'date-fns';

const MyRequestsPage = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');

  useEffect(() => {
    if (user) {
      setRequests(mockRequests);
      setFilteredRequests(mockRequests);
    }
  }, [user]);

  useEffect(() => {
    let filtered = requests;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(req =>
        req.itemRequested.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.requisitionNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.purpose.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter) {
      filtered = filtered.filter(req => req.status === statusFilter);
    }

    // Priority filter
    if (priorityFilter) {
      filtered = filtered.filter(req => req.priority === priorityFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'createdAt':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'updatedAt':
          return new Date(b.updatedAt) - new Date(a.updatedAt);
        case 'priority':
          const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case 'status':
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });

    setFilteredRequests(filtered);
  }, [requests, searchTerm, statusFilter, priorityFilter, sortBy]);

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'pending', label: 'Pending' },
    { value: 'assigned', label: 'Assigned' },
    { value: 'product_sourcing', label: 'Product Sourcing' },
    { value: 'create_po', label: 'Purchase Order Created' },
    { value: 'finance_approval', label: 'Finance Approval' },
    { value: 'md_approval', label: 'MD Approval' },
    { value: 'po_payment', label: 'Payment Processing' },
    { value: 'delivery', label: 'Awaiting Delivery' },
    { value: 'completed', label: 'Completed' },
    { value: 'declined', label: 'Declined' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  const priorityOptions = [
    { value: '', label: 'All Priorities' },
    { value: 'urgent', label: 'Urgent' },
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' }
  ];

  const sortOptions = [
    { value: 'createdAt', label: 'Date Created' },
    { value: 'updatedAt', label: 'Last Updated' },
    { value: 'priority', label: 'Priority' },
    { value: 'status', label: 'Status' }
  ];

  const getStatusColor = (status) => {
    const statusInfo = getStatusDisplayInfo(status);
    if (statusInfo.color.includes('green')) return 'success';
    if (statusInfo.color.includes('red')) return 'danger';
    if (statusInfo.color.includes('yellow')) return 'warning';
    if (statusInfo.color.includes('orange')) return 'warning';
    return 'info';
  };

  const getPriorityColor = (priority) => {
    const priorityInfo = getPriorityDisplayInfo(priority);
    if (priorityInfo.color.includes('red')) return 'danger';
    if (priorityInfo.color.includes('orange')) return 'warning';
    if (priorityInfo.color.includes('yellow')) return 'warning';
    return 'info';
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">All Requests</h1>
          <p className="mt-2 text-lg text-gray-600">
            View and track all procurement requests
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Input
                label="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search requests..."
                icon={Search}
              />
              
              <Select
                label="Status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                options={statusOptions}
              />
              
              <Select
                label="Priority"
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                options={priorityOptions}
              />
              
              <Select
                label="Sort By"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                options={sortOptions}
              />
            </div>
          </CardContent>
        </Card>

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-sm text-gray-600">
            Showing {filteredRequests.length} of {requests.length} requests
          </p>
        </div>

        {/* Requests List */}
        {filteredRequests.length > 0 ? (
          <div className="space-y-4">
            {filteredRequests.map((request) => (
              <Card key={request.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {request.itemRequested}
                        </h3>
                        <Badge 
                          variant={getStatusColor(request.status)}
                          icon={getStatusDisplayInfo(request.status).icon}
                        >
                          {getStatusDisplayInfo(request.status).label}
                        </Badge>
                        <Badge 
                          variant={getPriorityColor(request.priority)}
                          icon={getPriorityDisplayInfo(request.priority).icon}
                        >
                          {getPriorityDisplayInfo(request.priority).label}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <FileText className="h-4 w-4 mr-2" />
                          <span className="font-mono">{request.requisitionNumber}</span>
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>Created {format(new Date(request.createdAt), 'MMM dd, yyyy')}</span>
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-600">
                          <Building2 className="h-4 w-4 mr-2" />
                          <span>{request.department}</span>
                        </div>
                      </div>
                      
                      <p className="text-gray-700 mb-4">{request.purpose}</p>
                      
                      {request.assignedOfficer && (
                        <div className="flex items-center text-sm text-blue-600 mb-2">
                          <User className="h-4 w-4 mr-2" />
                          <span>Assigned to: {request.assignedOfficer}</span>
                        </div>
                      )}
                      
                      {request.poNumber && (
                        <div className="text-sm text-green-600 font-mono">
                          PO: {request.poNumber}
                        </div>
                      )}
                    </div>
                    
                    <div className="ml-4">
                      <Link href={`/track?req=${request.requisitionNumber}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm || statusFilter || priorityFilter ? 'No matching requests found' : 'No requests yet'}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || statusFilter || priorityFilter 
                  ? 'Try adjusting your filters to see more results.'
                  : 'Create your first procurement request to get started.'
                }
              </p>
              {!searchTerm && !statusFilter && !priorityFilter && (
                <Link href="/create-request">
                  <Button>
                    Create New Request
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MyRequestsPage;
