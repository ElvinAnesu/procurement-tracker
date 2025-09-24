'use client';
import { useState } from 'react';
import { Search, FileText, AlertCircle, Clock, Users, TrendingUp, DollarSign, CheckCircle } from 'lucide-react';
import Card, { CardHeader, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import StatusTracker from '../components/StatusTracker';
import Badge from '../components/ui/Badge';
import { format } from 'date-fns';

const TrackPage = () => {
  const [requisitionNumber, setRequisitionNumber] = useState('');
  const [request, setRequest] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Helper functions for status and priority display
  const getStatusDisplayInfo = (status) => {
    const statusMap = {
      'pending-assignment': { label: 'Pending Assignment', color: 'yellow', icon: Clock },
      'assigned-to-officer': { label: 'Assigned to Officer', color: 'blue', icon: Users },
      'product-sourcing': { label: 'Product Sourcing', color: 'purple', icon: TrendingUp },
      'po-created': { label: 'Purchase Order Created', color: 'indigo', icon: FileText },
      'finance-approval': { label: 'Finance Approval', color: 'orange', icon: DollarSign },
      'md-approval': { label: 'MD Approval', color: 'amber', icon: CheckCircle },
      'payment-processing': { label: 'Payment Processing', color: 'cyan', icon: DollarSign },
      'awaiting-delivery': { label: 'Awaiting Delivery', color: 'teal', icon: Clock },
      'completed': { label: 'Completed', color: 'green', icon: CheckCircle }
    };
    return statusMap[status] || { label: status, color: 'gray', icon: FileText };
  };

  const getPriorityDisplayInfo = (priority) => {
    const priorityMap = {
      'high': { label: 'High', color: 'red', icon: AlertCircle },
      'normal': { label: 'Normal', color: 'blue', icon: FileText },
      'low': { label: 'Low', color: 'green', icon: CheckCircle }
    };
    return priorityMap[priority] || { label: priority, color: 'gray', icon: FileText };
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!requisitionNumber.trim()) {
      setError('Please enter a requisition number');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      // Search for request by ID (requisition number is just the padded ID)
      const searchId = parseInt(requisitionNumber.replace(/^0+/, '') || '0');
      
      // Fetch the specific request with related data
      const response = await fetch(`/api/item-requests/${searchId}`);
      const result = await response.json();
      
      if (result.success && result.data) {
        setRequest(result.data);
      } else {
        setError('Request not found. Please check your requisition number.');
        setRequest(null);
      }
    } catch (err) {
      setError('An error occurred while searching. Please try again.');
      setRequest(null);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setRequisitionNumber('');
    setRequest(null);
    setError('');
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-4">
            Track Your Request
          </h1>
          <p className="text-base sm:text-lg text-gray-600 px-4">
            Enter your requisition number to track the status of your procurement request
          </p>
        </div>

        {/* Search Form */}
        <Card className="mb-6 sm:mb-8">
          <CardHeader>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Search Request</h2>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                <div className="flex-1">
                  <Input
                    label="Requisition Number"
                    value={requisitionNumber}
                    onChange={(e) => setRequisitionNumber(e.target.value)}
                    placeholder="e.g., 001"
                    error={error}
                  />
                </div>
                <div className="flex items-end">
                  <Button type="submit" loading={loading} className="w-full sm:w-auto">
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Search Results */}
        {request && (
          <div className="space-y-4 sm:space-y-6">
            {/* Request Overview */}
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Request Details</h2>
                  <Badge 
                    variant={getStatusDisplayInfo(request.status).color.includes('green') ? 'success' : 'info'}
                    icon={getStatusDisplayInfo(request.status).icon}
                    className="self-start sm:self-auto"
                  >
                    {getStatusDisplayInfo(request.status).label}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Item Requested</h3>
                    <p className="text-base sm:text-lg text-gray-900 break-words">{request.item}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Requisition Number</h3>
                    <p className="text-base sm:text-lg font-mono text-gray-900 break-all">{String(request.id).padStart(3, '0')}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Requester</h3>
                    <p className="text-base sm:text-lg text-gray-900">{request.requested_by}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Department</h3>
                    <p className="text-base sm:text-lg text-gray-900">{request.department_name}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Priority</h3>
                    <Badge 
                      variant={getPriorityDisplayInfo(request.priority).color.includes('red') ? 'danger' : 
                             getPriorityDisplayInfo(request.priority).color.includes('orange') ? 'warning' : 'info'}
                      icon={getPriorityDisplayInfo(request.priority).icon}
                    >
                      {getPriorityDisplayInfo(request.priority).label}
                    </Badge>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Created Date</h3>
                    <p className="text-base sm:text-lg text-gray-900">
                      {format(new Date(request.created_at), 'MMM dd, yyyy')}
                    </p>
                  </div>
                </div>

                {request.officer_name && (
                  <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-blue-50 rounded-lg">
                    <h3 className="text-sm font-medium text-blue-900 mb-1">Assigned Officer</h3>
                    <p className="text-sm sm:text-base text-blue-800">{request.officer_name}</p>
                    <p className="text-xs sm:text-sm text-blue-600 break-all">{request.officer_email}</p>
                  </div>
                )}

                {request.poNumber && (
                  <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-green-50 rounded-lg">
                    <h3 className="text-sm font-medium text-green-900 mb-1">Purchase Order</h3>
                    <p className="text-sm sm:text-base text-green-800 font-mono break-all">{request.poNumber}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Status Tracker */}
            <Card>
              <CardContent className="p-4 sm:p-6">
                <StatusTracker request={request} />
              </CardContent>
            </Card>


            {/* Actions */}
            <div className="flex justify-center">
              <Button variant="outline" onClick={handleClear} className="w-full sm:w-auto">
                Search Another Request
              </Button>
            </div>
          </div>
        )}

        {/* No Results Message */}
        {!request && !loading && requisitionNumber && (
          <Card>
            <CardContent className="p-6 sm:p-8 text-center">
              <AlertCircle className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No Request Found</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-4 px-4">
                We couldn&apos;t find a request with the requisition number &quot;{requisitionNumber}&quot;.
              </p>
              <Button variant="outline" onClick={handleClear} className="w-full sm:w-auto">
                Try Again
              </Button>
            </CardContent>
          </Card>
        )}

      </div>
    </div>
  );
};

export default TrackPage;
