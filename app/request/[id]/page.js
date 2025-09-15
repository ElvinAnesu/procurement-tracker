'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { mockRequests, getStatusDisplayInfo, getPriorityDisplayInfo } from '../../data/mockData';
import { 
  ArrowLeft, 
  Edit, 
  FileText, 
  Calendar, 
  User, 
  Building2, 
  Mail,
  Phone,
  CheckCircle,
  Clock,
  AlertTriangle
} from 'lucide-react';
import Card, { CardHeader, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import StatusTracker from '../../components/StatusTracker';
import Link from 'next/link';
import { format } from 'date-fns';

const RequestDetailsPage = () => {
  const params = useParams();
  const router = useRouter();
  const { user, hasRole } = useAuth();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      // In a real app, this would be an API call
      const foundRequest = mockRequests.find(req => req.id === params.id);
      setRequest(foundRequest);
      setLoading(false);
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading request details...</p>
        </div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Request Not Found</h1>
          <p className="text-gray-600 mb-6">The request you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/dashboard">
            <Button>Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Check if user has permission to view this request
  const canView = hasRole('procurement_manager') || 
                  hasRole('procurement_officer') || 
                  request.requesterEmail === user?.email;

  if (!canView) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">You don&apos;t have permission to view this request.</p>
          <Link href="/dashboard">
            <Button>Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  const canEdit = hasRole('procurement_officer') && request.assignedOfficerEmail === user?.email;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{request.itemRequested}</h1>
                <p className="text-lg text-gray-600">REQ: {request.requisitionNumber}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge 
                variant={getStatusDisplayInfo(request.status).color.includes('green') ? 'success' : 'info'}
                icon={getStatusDisplayInfo(request.status).icon}
                size="lg"
              >
                {getStatusDisplayInfo(request.status).label}
              </Badge>
              {canEdit && (
                <Button>
                  <Edit className="h-4 w-4 mr-2" />
                  Update Status
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Request Details */}
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold text-gray-900">Request Information</h2>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Item Requested</h3>
                    <p className="text-lg text-gray-900">{request.itemRequested}</p>
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
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Department</h3>
                    <p className="text-lg text-gray-900">{request.department}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Created Date</h3>
                    <p className="text-lg text-gray-900">
                      {format(new Date(request.createdAt), 'MMM dd, yyyy HH:mm')}
                    </p>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Purpose</h3>
                  <p className="text-gray-900">{request.purpose}</p>
                </div>
              </CardContent>
            </Card>

            {/* Status Tracker */}
            <Card>
              <CardContent className="p-6">
                <StatusTracker request={request} />
              </CardContent>
            </Card>

            {/* Tracking History */}
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold text-gray-900">Tracking History</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {request.trackingHistory.map((entry, index) => (
                    <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-blue-600">{index + 1}</span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <Badge 
                            variant={getStatusDisplayInfo(entry.stage).color.includes('green') ? 'success' : 'info'}
                            icon={getStatusDisplayInfo(entry.stage).icon}
                            size="sm"
                          >
                            {getStatusDisplayInfo(entry.stage).label}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            {format(new Date(entry.timestamp), 'MMM dd, yyyy HH:mm')}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700">{entry.note}</p>
                        <p className="text-xs text-gray-500 mt-1">Updated by: {entry.updatedBy}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Requester Information */}
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold text-gray-900">Requester Details</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <User className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">{request.requesterName}</p>
                      <p className="text-sm text-gray-500">Requester</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-900">{request.requesterEmail}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Building2 className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-900">{request.department}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Assignment Information */}
            {request.assignedOfficer && (
              <Card>
                <CardHeader>
                  <h2 className="text-lg font-semibold text-gray-900">Assignment Details</h2>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <User className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="font-medium text-gray-900">{request.assignedOfficer}</p>
                        <p className="text-sm text-gray-500">Procurement Officer</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-900">{request.assignedOfficerEmail}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Purchase Order Information */}
            {request.poNumber && (
              <Card>
                <CardHeader>
                  <h2 className="text-lg font-semibold text-gray-900">Purchase Order</h2>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-5 w-5 text-green-500" />
                      <span className="font-mono text-lg text-gray-900">{request.poNumber}</span>
                    </div>
                    <p className="text-sm text-gray-500">Purchase Order Number</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            {canEdit && (
              <Card>
                <CardHeader>
                  <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button className="w-full">
                      <Edit className="h-4 w-4 mr-2" />
                      Update Status
                    </Button>
                    <Button variant="outline" className="w-full">
                      <FileText className="h-4 w-4 mr-2" />
                      Add Note
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Calendar className="h-4 w-4 mr-2" />
                      Set Deadline
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestDetailsPage;
