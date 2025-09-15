'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import { DEPARTMENTS, PRIORITY_LEVELS } from '../data/mockData';
import { ArrowLeft, Save } from 'lucide-react';
import Card, { CardHeader, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Link from 'next/link';

const CreateRequestPage = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    itemRequested: '',
    requesterName: user?.name || '',
    requesterEmail: user?.email || '',
    department: user?.department || '',
    purpose: '',
    priority: 'medium'
  });
  const [errors, setErrors] = useState({});

  const priorityOptions = Object.entries(PRIORITY_LEVELS).map(([key, value]) => ({
    value,
    label: value.charAt(0).toUpperCase() + value.slice(1)
  }));

  const departmentOptions = DEPARTMENTS.map(dept => ({
    value: dept,
    label: dept
  }));

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.itemRequested.trim()) {
      newErrors.itemRequested = 'Item requested is required';
    }
    
    if (!formData.requesterName.trim()) {
      newErrors.requesterName = 'Requester name is required';
    }
    
    if (!formData.requesterEmail.trim()) {
      newErrors.requesterEmail = 'Requester email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.requesterEmail)) {
      newErrors.requesterEmail = 'Please enter a valid email address';
    }
    
    if (!formData.department) {
      newErrors.department = 'Department is required';
    }
    
    if (!formData.purpose.trim()) {
      newErrors.purpose = 'Purpose is required';
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate requisition number
      const requisitionNumber = `REQ-2024-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
      
      // In a real app, this would be saved to the database
      console.log('New request created:', {
        ...formData,
        requisitionNumber,
        id: Date.now().toString(),
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      
      // Redirect to success page or dashboard
      router.push(`/request-success?reqNumber=${requisitionNumber}`);
    } catch (error) {
      console.error('Error creating request:', error);
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                  value={formData.itemRequested}
                  onChange={(e) => handleChange('itemRequested', e.target.value)}
                  error={errors.itemRequested}
                  required
                  placeholder="e.g., Laptop Computer - Dell Latitude 5520"
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
                  value={formData.requesterName}
                  onChange={(e) => handleChange('requesterName', e.target.value)}
                  error={errors.requesterName}
                  required
                  placeholder="Your full name"
                />

                <Input
                  label="Requester Email"
                  type="email"
                  value={formData.requesterEmail}
                  onChange={(e) => handleChange('requesterEmail', e.target.value)}
                  error={errors.requesterEmail}
                  required
                  placeholder="your.email@hesu.com"
                />
              </div>

              <Select
                label="Department"
                value={formData.department}
                onChange={(e) => handleChange('department', e.target.value)}
                options={departmentOptions}
                error={errors.department}
                required
                placeholder="Select your department"
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Purpose of Request
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <textarea
                  value={formData.purpose}
                  onChange={(e) => handleChange('purpose', e.target.value)}
                  rows={4}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Describe the purpose and justification for this request..."
                  required
                />
                {errors.purpose && (
                  <p className="text-sm text-red-600 mt-1">{errors.purpose}</p>
                )}
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
    </div>
  );
};

export default CreateRequestPage;
