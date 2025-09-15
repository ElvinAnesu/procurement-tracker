'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { mockRequests, getStatusDisplayInfo, getPriorityDisplayInfo } from '../data/mockData';
import { 
  Search, 
  Filter, 
  Eye, 
  Edit,
  User,
  Building2,
  Calendar,
  FileText,
  CheckCircle,
  Clock
} from 'lucide-react';
import Card, { CardHeader, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Badge from '../components/ui/Badge';
import Link from 'next/link';
import { format } from 'date-fns';

const AllRequestsPage = () => {
  const { user, hasRole } = useAuth();
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [officerFilter, setOfficerFilter] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');

  useEffect(() => {
    if (user) {
      let allRequests = [...mockRequests];
      
      // If user is a procurement officer, show only their assigned requests
      if (hasRole('procurement_officer')) {
        allRequests = allRequests.filter(req => req.assignedOfficerEmail === user.email);
      }
      
      setRequests(allRequests);
      setFilteredRequests(allRequests);
    }
  }, [user, hasRole]);

  useEffect(() => {
    let filtered = requests;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(req =>
        req.itemRequested.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.requisitionNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.requesterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
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

    // Officer filter
    if (officerFilter) {
      filtered = filtered.filter(req => req.assignedOfficerEmail === officerFilter);
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
  }, [requests, searchTerm, statusFilter, priorityFilter, officerFilter, sortBy]);

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'pending', label: 'Pending Assignment' },
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

  const officerOptions = [
    { value: '', label: 'All Officers' },
    { value: 'unassigned', label: 'Unassigned' },
    ...Array.from(new Set(requests.map(req => req.assignedOfficerEmail).filter(Boolean)))
      .map(email => ({
        value: email,
        label: requests.find(req => req.assignedOfficerEmail === email)?.assignedOfficer || email
      }))
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

  const getStats = () => {
    const total = requests.length;
    const pending = requests.filter(req => 
      ['pending', 'assigned', 'product_sourcing', 'create_po', 'finance_approval', 'md_approval', 'po_payment', 'delivery'].includes(req.status)
    ).length;
    const completed = requests.filter(req => req.status === 'completed').length;
    const urgent = requests.filter(req => req.priority === 'urgent').length;
    
    return { total, pending, completed, urgent };
  };

  const stats = getStats();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {hasRole('procurement_officer') ? 'My Assigned Requests' : 'All Requests'}
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            {hasRole('procurement_officer') 
              ? 'Manage your assigned procurement requests'
              : 'View and manage all procurement requests'
            }
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FileText className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Clock className="h-8 w-8 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Pending</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.pending}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Completed</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.completed}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FileText className="h-8 w-8 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Urgent</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.urgent}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <Input
                label="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search requests..."
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
              
              {hasRole('procurement_manager') && (
                <Select
                  label="Officer"
                  value={officerFilter}
                  onChange={(e) => setOfficerFilter(e.target.value)}
                  options={officerOptions}
                />
              )}
              
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

        {/* Requests Table */}
        {filteredRequests.length > 0 ? (
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Request
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Requester
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Priority
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Assigned Officer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredRequests.map((request) => (
                      <tr key={request.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {request.itemRequested}
                            </div>
                            <div className="text-sm text-gray-500 font-mono">
                              {request.requisitionNumber}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {request.requesterName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {request.department}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge 
                            variant={getPriorityColor(request.priority)}
                            icon={getPriorityDisplayInfo(request.priority).icon}
                            size="sm"
                          >
                            {getPriorityDisplayInfo(request.priority).label}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <Badge 
                            variant={getStatusColor(request.status)}
                            icon={getStatusDisplayInfo(request.status).icon}
                            size="sm"
                          >
                            {getStatusDisplayInfo(request.status).label}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {request.assignedOfficer || (
                              <span className="text-gray-400 italic">Unassigned</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {format(new Date(request.createdAt), 'MMM dd, yyyy')}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium">
                          <div className="flex space-x-2">
                            <Link href={`/track?req=${request.requisitionNumber}`}>
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                            {hasRole('procurement_officer') && (
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm || statusFilter || priorityFilter || officerFilter ? 'No matching requests found' : 'No requests available'}
              </h3>
              <p className="text-gray-600">
                {searchTerm || statusFilter || priorityFilter || officerFilter 
                  ? 'Try adjusting your filters to see more results.'
                  : 'There are no procurement requests at the moment.'
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AllRequestsPage;
