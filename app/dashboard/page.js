'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Plus, 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  TrendingUp,
  Users,
  DollarSign
} from 'lucide-react';
import Card, { CardHeader, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Link from 'next/link';
import { format } from 'date-fns';

const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalRequests: 0,
    pendingRequests: 0,
    completedRequests: 0,
    urgentRequests: 0
  });
  const [recentRequests, setRecentRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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
      'high': { label: 'High', color: 'red', icon: AlertTriangle },
      'normal': { label: 'Normal', color: 'blue', icon: FileText },
      'low': { label: 'Low', color: 'green', icon: CheckCircle }
    };
    return priorityMap[priority] || { label: priority, color: 'gray', icon: FileText };
  };

  // Fetch requests from database
  const fetchRequests = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/item-requests');
      const result = await response.json();
      
      if (result.success) {
        const requests = result.data;
        
        // Calculate stats
        const total = requests.length;
        const pending = requests.filter(req => 
          ['pending-assignment', 'assigned-to-officer', 'product-sourcing', 'po-created', 'finance-approval', 'md-approval', 'payment-processing', 'awaiting-delivery'].includes(req.status)
        ).length;
        const completed = requests.filter(req => req.status === 'completed').length;
        const urgent = requests.filter(req => req.priority === 'high').length;

        setStats({ totalRequests: total, pendingRequests: pending, completedRequests: completed, urgentRequests: urgent });
        setRecentRequests(requests.slice(0, 5)); // Get 5 most recent
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
    if (user) {
      fetchRequests();
    }
  }, [user]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const content = {
    title: 'Procurement Management',
    description: 'Manage and track all procurement requests',
    primaryAction: { text: 'Create New Request', href: '/create-request' },
    secondaryAction: { text: 'View All Requests', href: '/all-requests' }
  };

  if (isLoading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading dashboard...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {getGreeting()}, {user?.firstname} {user?.lastname}!
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            {content.description}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FileText className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Requests</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.totalRequests}</p>
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
                  <p className="text-2xl font-semibold text-gray-900">{stats.pendingRequests}</p>
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
                  <p className="text-2xl font-semibold text-gray-900">{stats.completedRequests}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Urgent</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.urgentRequests}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Link href={content.primaryAction.href}>
                  <Button className="w-full justify-start">
                    <Plus className="h-4 w-4 mr-2" />
                    {content.primaryAction.text}
                  </Button>
                </Link>
                <Link href={content.secondaryAction.href}>
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="h-4 w-4 mr-2" />
                    {content.secondaryAction.text}
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentRequests.length > 0 ? (
                  recentRequests.map((request) => (
                    <div key={request.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{request.item}</p>
                        <p className="text-xs text-gray-500">REQ: {String(request.id).padStart(3, '0')}</p>
                      </div>
                      <Badge 
                        variant={getStatusDisplayInfo(request.status).color.includes('green') ? 'success' : 'info'}
                        icon={getStatusDisplayInfo(request.status).icon}
                        size="sm"
                      >
                        {getStatusDisplayInfo(request.status).label}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No recent requests</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Requests Table */}
        {recentRequests.length > 0 && (
          <Card>
            <CardHeader>
              <h3 className="text-lg font-medium text-gray-900">Recent Requests</h3>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Request
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Priority
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentRequests.map((request) => (
                      <tr key={request.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {request.item}
                            </div>
                            <div className="text-sm text-gray-500">
                              {String(request.id).padStart(3, '0')}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge 
                            variant={getPriorityDisplayInfo(request.priority).color.includes('red') ? 'danger' : 
                                   getPriorityDisplayInfo(request.priority).color.includes('orange') ? 'warning' : 'info'}
                            icon={getPriorityDisplayInfo(request.priority).icon}
                            size="sm"
                          >
                            {getPriorityDisplayInfo(request.priority).label}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge 
                            variant={getStatusDisplayInfo(request.status).color.includes('green') ? 'success' : 'info'}
                            icon={getStatusDisplayInfo(request.status).icon}
                            size="sm"
                          >
                            {getStatusDisplayInfo(request.status).label}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {format(new Date(request.created_at), 'MMM dd, yyyy')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
        </div>
      </div>
  );
};

export default DashboardPage;
