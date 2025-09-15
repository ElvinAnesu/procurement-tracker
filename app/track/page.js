'use client';

import { useState } from 'react';
import { Search, FileText, AlertCircle } from 'lucide-react';
import { mockRequests, getStatusDisplayInfo, getPriorityDisplayInfo } from '../data/mockData';
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

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!requisitionNumber.trim()) {
      setError('Please enter a requisition number');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const foundRequest = mockRequests.find(req => 
        req.requisitionNumber.toLowerCase() === requisitionNumber.toLowerCase()
      );
      
      if (foundRequest) {
        setRequest(foundRequest);
      } else {
        setError('Request not found. Please check your requisition number.');
        setRequest(null);
      }
    } catch (err) {
      setError('An error occurred while searching. Please try again.');
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
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
                    placeholder="e.g., REQ-2024-001"
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
                    <p className="text-base sm:text-lg text-gray-900 break-words">{request.itemRequested}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Requisition Number</h3>
                    <p className="text-base sm:text-lg font-mono text-gray-900 break-all">{request.requisitionNumber}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Requester</h3>
                    <p className="text-base sm:text-lg text-gray-900">{request.requesterName}</p>
                    <p className="text-sm text-gray-600 break-all">{request.requesterEmail}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Department</h3>
                    <p className="text-base sm:text-lg text-gray-900">{request.department}</p>
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
                      {format(new Date(request.createdAt), 'MMM dd, yyyy')}
                    </p>
                  </div>
                </div>
                
                <div className="mt-4 sm:mt-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Purpose</h3>
                  <p className="text-sm sm:text-base text-gray-900">{request.purpose}</p>
                </div>

                {request.assignedOfficer && (
                  <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-blue-50 rounded-lg">
                    <h3 className="text-sm font-medium text-blue-900 mb-1">Assigned Officer</h3>
                    <p className="text-sm sm:text-base text-blue-800">{request.assignedOfficer}</p>
                    <p className="text-xs sm:text-sm text-blue-600 break-all">{request.assignedOfficerEmail}</p>
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

            {/* Tracking History */}
            <Card>
              <CardHeader>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Tracking History</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 sm:space-y-4">
                  {request.trackingHistory.map((entry, index) => (
                    <div key={index} className="flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-xs sm:text-sm font-medium text-blue-600">{index + 1}</span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2 mb-1">
                          <Badge 
                            variant={getStatusDisplayInfo(entry.stage).color.includes('green') ? 'success' : 'info'}
                            icon={getStatusDisplayInfo(entry.stage).icon}
                            size="sm"
                          >
                            {getStatusDisplayInfo(entry.stage).label}
                          </Badge>
                          <span className="text-xs sm:text-sm text-gray-500">
                            {format(new Date(entry.timestamp), 'MMM dd, yyyy HH:mm')}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-700">{entry.note}</p>
                        <p className="text-xs text-gray-500 mt-1">Updated by: {entry.updatedBy}</p>
                      </div>
                    </div>
                  ))}
                </div>
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

        {/* Demo Information */}
        <Card className="mt-6 sm:mt-8">
          <CardHeader>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Demo Requisition Numbers</h2>
          </CardHeader>
          <CardContent>
            <p className="text-sm sm:text-base text-gray-600 mb-4">
              Try searching with these demo requisition numbers:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {mockRequests.map((req) => (
                <button
                  key={req.id}
                  onClick={() => setRequisitionNumber(req.requisitionNumber)}
                  className="text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="font-mono text-xs sm:text-sm text-blue-600 break-all">{req.requisitionNumber}</div>
                  <div className="text-xs sm:text-sm text-gray-600 truncate">{req.itemRequested}</div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TrackPage;
