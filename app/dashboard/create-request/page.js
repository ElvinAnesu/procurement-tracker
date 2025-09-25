'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { ArrowLeft, Save } from 'lucide-react';
import Card, { CardHeader, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Link from 'next/link';

const CreateRequestPage = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    item: '',
    requested_by: user?.firstname && user?.lastname ? `${user.firstname} ${user.lastname}` : '',
    department: '',
    priority: 'normal'
  });
  const [errors, setErrors] = useState({});
  const [departments, setDepartments] = useState([]);
  const [isLoadingDepartments, setIsLoadingDepartments] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdRequestId, setCreatedRequestId] = useState(null);

  const priorityOptions = [
    { value: 'normal', label: 'Normal' },
    { value: 'high', label: 'High' },
    { value: 'low', label: 'Low' }
  ];

  // Fetch departments from database
  const fetchDepartments = async () => {
    try {
      setIsLoadingDepartments(true);
      const response = await fetch('/api/departments');
      const result = await response.json();
      
      if (result.success) {
        setDepartments(result.data);
      } else {
        console.error('Error fetching departments:', result.error);
      }
    } catch (error) {
      console.error('Error fetching departments:', error);
    } finally {
      setIsLoadingDepartments(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const departmentOptions = departments.map(dept => ({
    value: dept.id, // Use UUID as value
    label: dept.name // Display name as label
  }));

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.item.trim()) {
      newErrors.item = 'Item requested is required';
    }
    
    if (!formData.requested_by.trim()) {
      newErrors.requested_by = 'Requester name is required';
    }
    
    if (!formData.department) {
      newErrors.department = 'Department is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch('/api/item-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          item: formData.item,
          requested_by: formData.requested_by,
          priority: formData.priority,
          department: formData.department
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        // Store the created request ID and show success modal
        setCreatedRequestId(result.data.id);
        setShowSuccessModal(true);
        
        // Reset form for next request
        setFormData({
          item: '',
          requested_by: user?.firstname && user?.lastname ? `${user.firstname} ${user.lastname}` : '',
          department: '',
          priority: 'normal'
        });
      } else {
        alert('Error creating request: ' + result.error);
      }
    } catch (error) {
      console.error('Error creating request:', error);
      alert('Error creating request');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleCreateAnother = () => {
    setShowSuccessModal(false);
    setCreatedRequestId(null);
  };

  const handleViewRequests = () => {
    setShowSuccessModal(false);
    router.push('/dashboard/all-requests');
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Create New Request</h1>
          <p className="mt-2 text-lg text-gray-600">
            Submit a new procurement request for your department
          </p>
        </div>

        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900">Request Details</h2>
            <p className="text-sm text-gray-600">
              Please provide all the necessary information for your procurement request
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Item Requested"
                  value={formData.item}
                  onChange={(e) => handleChange('item', e.target.value)}
                  error={errors.item}
                  required
                />

                <Select
                  label="Priority Level"
                  value={formData.priority}
                  onChange={(e) => handleChange('priority', e.target.value)}
                  options={priorityOptions}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Requester Name"
                  value={formData.requested_by}
                  onChange={(e) => handleChange('requested_by', e.target.value)}
                  error={errors.requested_by}
                  required
                />

                <Select
                  label="Department"
                  value={formData.department}
                  onChange={(e) => handleChange('department', e.target.value)}
                  options={departmentOptions}
                  error={errors.department}
                  required
                  disabled={isLoadingDepartments}
                />
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <Link href="/dashboard">
                  <Button variant="outline" type="button">
                    Cancel
                  </Button>
                </Link>
                <Button type="submit" loading={loading}>
                  <Save className="h-4 w-4 mr-2" />
                  Submit Request
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Blurry Background */}
          <div 
            className="absolute inset-0 backdrop-blur-md"
            onClick={() => setShowSuccessModal(false)}
          />
          
          {/* Modal Content */}
          <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
            <div className="text-center">
              {/* Success Icon */}
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              {/* Success Message */}
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Request Created Successfully!
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Your procurement request has been submitted and is now pending assignment.
              </p>
              
              {/* Action Buttons */}
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={handleCreateAnother}
                  className="flex-1"
                >
                  Create Another
                </Button>
                <Button
                  onClick={handleViewRequests}
                  className="flex-1"
                >
                  View Requests
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateRequestPage;
