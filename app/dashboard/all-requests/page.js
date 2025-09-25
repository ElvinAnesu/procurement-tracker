'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
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
import Card, { CardHeader, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Badge from '../../components/ui/Badge';
import Link from 'next/link';
import { format } from 'date-fns';

const AllRequestsPage = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingRequest, setEditingRequest] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [selectedOfficer, setSelectedOfficer] = useState('');
  const [officers, setOfficers] = useState([]);
  const [isLoadingOfficers, setIsLoadingOfficers] = useState(false);

  // Fetch requests from database
  const fetchRequests = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/item-requests');
      const result = await response.json();
      
      if (result.success) {
        setRequests(result.data);
        setFilteredRequests(result.data);
      } else {
        console.error('Error fetching requests:', result.error);
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // Fetch officers when modal opens
  const fetchOfficers = async () => {
    try {
      setIsLoadingOfficers(true);
      const response = await fetch('/api/procurement-officers');
      const result = await response.json();
      
      if (result.success) {
        setOfficers(result.data);
      } else {
        console.error('Error fetching officers:', result.error);
      }
    } catch (error) {
      console.error('Error fetching officers:', error);
    } finally {
      setIsLoadingOfficers(false);
    }
  };

  useEffect(() => {
    let filtered = requests;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(req =>
        req.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.requested_by.toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(req.id).padStart(3, '0').toLowerCase().includes(searchTerm.toLowerCase())
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

    // Sort by creation date (newest first)
    filtered.sort((a, b) => {
      return new Date(b.created_at) - new Date(a.created_at);
    });

    setFilteredRequests(filtered);
  }, [requests, searchTerm, statusFilter, priorityFilter]);

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'pending-assignment', label: 'Pending Assignment' },
    { value: 'assigned-to-officer', label: 'Assigned to Officer' },
    { value: 'product-sourcing', label: 'Product Sourcing' },
    { value: 'po-created', label: 'Purchase Order Created' },
    { value: 'finance-approval', label: 'Finance Approval' },
    { value: 'md-approval', label: 'MD Approval' },
    { value: 'payment-processing', label: 'Payment Processing' },
    { value: 'awaiting-delivery', label: 'Awaiting Delivery' },
    { value: 'completed', label: 'Completed' }
  ];

  const priorityOptions = [
    { value: '', label: 'All Priorities' },
    { value: 'high', label: 'High' },
    { value: 'normal', label: 'Normal' },
    { value: 'low', label: 'Low' }
  ];

  // Get available status options based on current status (step-by-step workflow)
  const getAvailableStatusOptions = (currentStatus) => {
    const statusOrder = [
      'pending-assignment',
      'assigned-to-officer', 
      'product-sourcing',
      'po-created',
      'finance-approval',
      'md-approval',
      'payment-processing',
      'awaiting-delivery',
      'completed'
    ];

    const currentIndex = statusOrder.indexOf(currentStatus);
    
    if (currentIndex === -1) {
      // If current status not found, return all options
      return statusOrder.map(status => ({
        value: status,
        label: getStatusDisplayInfo(status).label
      }));
    }

    // Get all previous steps + current step + next step only
    const availableOptions = [];
    
    // Add all previous steps (can go backwards)
    for (let i = 0; i <= currentIndex; i++) {
      availableOptions.push({
        value: statusOrder[i],
        label: getStatusDisplayInfo(statusOrder[i]).label
      });
    }
    
    // Add next step if it exists (can move forward one step)
    if (currentIndex < statusOrder.length - 1) {
      availableOptions.push({
        value: statusOrder[currentIndex + 1],
        label: getStatusDisplayInfo(statusOrder[currentIndex + 1]).label
      });
    }

    return availableOptions;
  };


  const getStatusDisplayInfo = (status) => {
    const statusMap = {
      'pending-assignment': { label: 'Pending Assignment', color: 'yellow', icon: Clock },
      'assigned-to-officer': { label: 'Assigned', color: 'blue', icon: User },
      'product-sourcing': { label: 'Product Sourcing', color: 'orange', icon: Search },
      'po-created': { label: 'PO Created', color: 'purple', icon: FileText },
      'finance-approval': { label: 'Finance Approval', color: 'yellow', icon: Clock },
      'md-approval': { label: 'MD Approval', color: 'yellow', icon: Clock },
      'payment-processing': { label: 'Payment Processing', color: 'blue', icon: Clock },
      'awaiting-delivery': { label: 'Awaiting Delivery', color: 'orange', icon: Clock },
      'completed': { label: 'Completed', color: 'green', icon: CheckCircle }
    };
    return statusMap[status] || { label: status, color: 'gray', icon: Clock };
  };

  const getPriorityDisplayInfo = (priority) => {
    const priorityMap = {
      'high': { label: 'High', color: 'red', icon: FileText },
      'normal': { label: 'Normal', color: 'blue', icon: FileText },
      'low': { label: 'Low', color: 'gray', icon: FileText }
    };
    return priorityMap[priority] || { label: priority, color: 'gray', icon: FileText };
  };

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
      ['pending-assignment', 'assigned-to-officer', 'product-sourcing', 'po-created', 'finance-approval', 'md-approval', 'payment-processing', 'awaiting-delivery'].includes(req.status)
    ).length;
    const completed = requests.filter(req => req.status === 'completed').length;
    const urgent = requests.filter(req => req.priority === 'high').length;
    
    return { total, pending, completed, urgent };
  };

  const stats = getStats();

  // Modal handlers
  const handleEditRequest = (request) => {
    setEditingRequest(request);
    setNewStatus(request.status);
    setSelectedOfficer('');
    setShowEditModal(true);
    fetchOfficers(); // Fetch officers when modal opens
  };

  const handleUpdateStatus = async () => {
    if (!editingRequest || !newStatus) return;

    // If assigning to officer, require officer selection
    if (newStatus === 'assigned-to-officer' && !selectedOfficer) {
      alert('Please select an officer to assign this request to.');
      return;
    }

    try {
      const updateData = {
        id: editingRequest.id,
        status: newStatus
      };

      // If assigning to officer, also update the assigned_to field
      if (newStatus === 'assigned-to-officer') {
        updateData.assigned_to = selectedOfficer;
      }

      const response = await fetch('/api/item-requests', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      const result = await response.json();
      
      if (result.success) {
        // Update the request in the local state
        setRequests(prev => prev.map(req => 
          req.id === editingRequest.id ? { 
            ...req, 
            status: newStatus,
            assigned_to: newStatus === 'assigned-to-officer' ? selectedOfficer : req.assigned_to
          } : req
        ));
        setShowEditModal(false);
        setEditingRequest(null);
        setNewStatus('');
        setSelectedOfficer('');
      } else {
        alert('Error updating request: ' + result.error);
      }
    } catch (error) {
      console.error('Error updating request:', error);
      alert('Error updating request');
    }
  };

  const handleCancelEdit = () => {
    setShowEditModal(false);
    setEditingRequest(null);
    setNewStatus('');
    setSelectedOfficer('');
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">All Requests</h1>
          <p className="mt-2 text-lg text-gray-600">
            View and manage all procurement requests
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <Input
                  label="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search requests..."
                />
              </div>
              
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
        {isLoading ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading requests...</p>
            </CardContent>
          </Card>
        ) : filteredRequests.length > 0 ? (
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
                              {request.item}
                            </div>
                            <div className="text-sm text-gray-500 font-mono">
                              {String(request.id).padStart(3, '0')}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {request.requested_by}
                            </div>
                            <div className="text-sm text-gray-500">
                              Department
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
                            {request.procurement_officers ? (
                              `${request.procurement_officers.firstname} ${request.procurement_officers.lastname}`
                            ) : (
                              <span className="text-gray-400 italic">Unassigned</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {format(new Date(request.created_at), 'MMM dd, yyyy')}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium">
                          <div className="flex space-x-2">
                            <Link href={`/track?req=${String(request.id).padStart(3, '0')}`}>
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleEditRequest(request)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
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

        {/* Edit Status Modal */}
        {showEditModal && editingRequest && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Blurry Background */}
            <div 
              className="absolute inset-0 backdrop-blur-md"
              onClick={handleCancelEdit}
            />
            
            {/* Modal Content */}
            <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Update Request Status
                </h3>
                <p className="text-sm text-gray-600">
                  Request #{String(editingRequest.id).padStart(3, '0')} - {editingRequest.item}
                </p>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Status
                </label>
                <div className="p-3 bg-gray-50 rounded-md">
                  <Badge 
                    variant={getStatusColor(editingRequest.status)}
                    icon={getStatusDisplayInfo(editingRequest.status).icon}
                    size="sm"
                  >
                    {getStatusDisplayInfo(editingRequest.status).label}
                  </Badge>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Status
                </label>
                <Select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  options={getAvailableStatusOptions(editingRequest.status)}
                />
              </div>

              {/* Officer Selection - Only show when user selects "Assigned to Officer" */}
              {newStatus === 'assigned-to-officer' && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Officer
                  </label>
                  {isLoadingOfficers ? (
                    <div className="p-3 bg-gray-50 rounded-md text-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mx-auto mb-2"></div>
                      <p className="text-sm text-gray-600">Loading officers...</p>
                    </div>
                  ) : (
                    <Select
                      value={selectedOfficer}
                      onChange={(e) => setSelectedOfficer(e.target.value)}
                      options={[
                        { value: '', label: 'Select an officer...' },
                        ...officers.map(officer => ({
                          value: officer.id,
                          label: `${officer.firstname} ${officer.lastname}`
                        }))
                      ]}
                    />
                  )}
                </div>
              )}
              
              {/* Action Buttons */}
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={handleCancelEdit}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUpdateStatus}
                  className="flex-1"
                >
                  Update Status
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllRequestsPage;
