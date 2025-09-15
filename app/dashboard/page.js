'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';
import { mockRequests, getStatusDisplayInfo, getPriorityDisplayInfo } from '../data/mockData';
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
  const { user, hasRole } = useAuth();
  const [stats, setStats] = useState({
    totalRequests: 0,
    pendingRequests: 0,
    completedRequests: 0,
    urgentRequests: 0
  });
  const [recentRequests, setRecentRequests] = useState([]);

  useEffect(() => {
    if (user) {
      let userRequests = [];
      
      if (hasRole('request_initiator') || hasRole('general_user')) {
        userRequests = mockRequests.filter(req => req.requesterEmail === user.email);
      } else if (hasRole('procurement_manager') || hasRole('procurement_officer')) {
        userRequests = mockRequests;
      }

      const total = userRequests.length;
      const pending = userRequests.filter(req => 
        ['pending', 'assigned', 'product_sourcing', 'create_po', 'finance_approval', 'md_approval', 'po_payment', 'delivery'].includes(req.status)
      ).length;
      const completed = userRequests.filter(req => req.status === 'completed').length;
      const urgent = userRequests.filter(req => req.priority === 'urgent').length;

      setStats({ totalRequests: total, pendingRequests: pending, completedRequests: completed, urgentRequests: urgent });
      setRecentRequests(userRequests.slice(0, 5));
    }
  }, [user, hasRole]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getRoleSpecificContent = () => {
    if (hasRole('request_initiator')) {
      return {
        title: 'Request Management',
        description: 'Create and track your procurement requests',
        primaryAction: { text: 'Create New Request', href: '/create-request' },
        secondaryAction: { text: 'View My Requests', href: '/my-requests' }
      };
    } else if (hasRole('procurement_manager')) {
      return {
        title: 'Procurement Management',
        description: 'Manage procurement officers and oversee all requests',
        primaryAction: { text: 'Manage Officers', href: '/manage-officers' },
        secondaryAction: { text: 'View All Requests', href: '/all-requests' }
      };
    } else if (hasRole('procurement_officer')) {
      return {
        title: 'Procurement Operations',
        description: 'Process and track procurement requests',
        primaryAction: { text: 'View All Requests', href: '/all-requests' },
        secondaryAction: { text: 'My Assigned Requests', href: '/my-assigned-requests' }
      };
    } else {
      return {
        title: 'Request Tracking',
        description: 'Track your procurement requests',
        primaryAction: { text: 'Track Request', href: '/track' },
        secondaryAction: { text: 'View My Requests', href: '/my-requests' }
      };
    }
  };

  const content = getRoleSpecificContent();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {getGreeting()}, {user?.name}!
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
                        <p className="text-sm font-medium text-gray-900">{request.itemRequested}</p>
                        <p className="text-xs text-gray-500">REQ: {request.requisitionNumber}</p>
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
                              {request.itemRequested}
                            </div>
                            <div className="text-sm text-gray-500">
                              {request.requisitionNumber}
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
                          {format(new Date(request.createdAt), 'MMM dd, yyyy')}
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
    </ProtectedRoute>
  );
};

export default DashboardPage;
