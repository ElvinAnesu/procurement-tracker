'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { mockUsers, mockRequests, USER_ROLES } from '../data/mockData';
import { 
  Plus, 
  Edit, 
  Trash2, 
  User, 
  Mail, 
  Building2,
  FileText,
  CheckCircle,
  Clock
} from 'lucide-react';
import Card, { CardHeader, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import { format } from 'date-fns';

const ManageOfficersPage = () => {
  const { user } = useAuth();
  const [officers, setOfficers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOfficers, setFilteredOfficers] = useState([]);

  useEffect(() => {
    if (user) {
      const procurementOfficers = mockUsers.filter(u => u.role === USER_ROLES.PROCUREMENT_OFFICER);
      setOfficers(procurementOfficers);
      setFilteredOfficers(procurementOfficers);
    }
  }, [user]);

  useEffect(() => {
    let filtered = officers;

    if (searchTerm) {
      filtered = filtered.filter(officer =>
        officer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        officer.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredOfficers(filtered);
  }, [officers, searchTerm]);

  const getOfficerStats = (officerEmail) => {
    const assignedRequests = mockRequests.filter(req => req.assignedOfficerEmail === officerEmail);
    const completedRequests = assignedRequests.filter(req => req.status === 'completed').length;
    const pendingRequests = assignedRequests.filter(req => 
      ['assigned', 'product_sourcing', 'create_po', 'finance_approval', 'md_approval', 'po_payment', 'delivery'].includes(req.status)
    ).length;
    
    return {
      total: assignedRequests.length,
      completed: completedRequests,
      pending: pendingRequests
    };
  };

  const getOfficerPerformance = (officerEmail) => {
    const stats = getOfficerStats(officerEmail);
    if (stats.total === 0) return { label: 'No Activity', color: 'gray' };
    
    const completionRate = (stats.completed / stats.total) * 100;
    
    if (completionRate >= 80) return { label: 'Excellent', color: 'green' };
    if (completionRate >= 60) return { label: 'Good', color: 'blue' };
    if (completionRate >= 40) return { label: 'Average', color: 'yellow' };
    return { label: 'Needs Improvement', color: 'red' };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Manage Officers</h1>
          <p className="mt-2 text-lg text-gray-600">
            Manage procurement officers and their assignments
          </p>
        </div>

        {/* Search and Actions */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div className="flex-1 max-w-md">
                <Input
                  label="Search Officers"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name or email..."
                />
              </div>
              <div className="flex space-x-3">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Officer
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Officers Grid */}
        {filteredOfficers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOfficers.map((officer) => {
              const stats = getOfficerStats(officer.email);
              const performance = getOfficerPerformance(officer.email);
              
              return (
                <Card key={officer.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {officer.name}
                          </h3>
                          <p className="text-sm text-gray-600">{officer.department}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="h-4 w-4 mr-2" />
                        <span>{officer.email}</span>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600">
                        <Building2 className="h-4 w-4 mr-2" />
                        <span>{officer.department}</span>
                      </div>
                    </div>

                    {/* Performance Stats */}
                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Performance</span>
                        <Badge 
                          variant={performance.color === 'green' ? 'success' : 
                                 performance.color === 'blue' ? 'info' :
                                 performance.color === 'yellow' ? 'warning' : 'danger'}
                        >
                          {performance.label}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-semibold text-gray-900">{stats.total}</div>
                          <div className="text-xs text-gray-500">Total</div>
                        </div>
                        <div>
                          <div className="text-2xl font-semibold text-green-600">{stats.completed}</div>
                          <div className="text-xs text-gray-500">Completed</div>
                        </div>
                        <div>
                          <div className="text-2xl font-semibold text-yellow-600">{stats.pending}</div>
                          <div className="text-xs text-gray-500">Pending</div>
                        </div>
                      </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="border-t border-gray-200 pt-4 mt-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Recent Activity</h4>
                      <div className="space-y-2">
                        {mockRequests
                          .filter(req => req.assignedOfficerEmail === officer.email)
                          .slice(0, 3)
                          .map((request) => (
                            <div key={request.id} className="flex items-center justify-between text-xs">
                              <div className="flex items-center space-x-2">
                                <FileText className="h-3 w-3 text-gray-400" />
                                <span className="text-gray-600 truncate max-w-32">
                                  {request.requisitionNumber}
                                </span>
                              </div>
                              <div className="flex items-center space-x-1">
                                {request.status === 'completed' ? (
                                  <CheckCircle className="h-3 w-3 text-green-500" />
                                ) : (
                                  <Clock className="h-3 w-3 text-yellow-500" />
                                )}
                              </div>
                            </div>
                          ))}
                        {mockRequests.filter(req => req.assignedOfficerEmail === officer.email).length === 0 && (
                          <p className="text-xs text-gray-500 italic">No recent activity</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? 'No officers found' : 'No officers available'}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm 
                  ? 'Try adjusting your search criteria.'
                  : 'Add procurement officers to get started.'
                }
              </p>
              {!searchTerm && (
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Officer
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Summary Stats */}
        {filteredOfficers.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <h2 className="text-lg font-semibold text-gray-900">Officer Summary</h2>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">{filteredOfficers.length}</div>
                  <div className="text-sm text-gray-500">Total Officers</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">
                    {filteredOfficers.filter(officer => {
                      const performance = getOfficerPerformance(officer.email);
                      return performance.color === 'green';
                    }).length}
                  </div>
                  <div className="text-sm text-gray-500">High Performers</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">
                    {filteredOfficers.reduce((total, officer) => {
                      return total + getOfficerStats(officer.email).total;
                    }, 0)}
                  </div>
                  <div className="text-sm text-gray-500">Total Assignments</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-600">
                    {filteredOfficers.reduce((total, officer) => {
                      return total + getOfficerStats(officer.email).pending;
                    }, 0)}
                  </div>
                  <div className="text-sm text-gray-500">Pending Requests</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ManageOfficersPage;
