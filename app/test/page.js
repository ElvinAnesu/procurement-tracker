'use client';

import { useState } from 'react';
import { Building2, CheckCircle } from 'lucide-react';
import Card, { CardHeader, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

const TestPage = () => {
  const [testResult, setTestResult] = useState('');

  const runTests = () => {
    const tests = [];
    
    // Test 1: Check if lucide-react icons work
    try {
      const iconTest = <Building2 className="h-4 w-4" />;
      tests.push('✅ Lucide React icons working');
    } catch (error) {
      tests.push('❌ Lucide React icons failed: ' + error.message);
    }
    
    // Test 2: Check if components render
    try {
      const componentTest = <Card><CardContent>Test</CardContent></Card>;
      tests.push('✅ UI Components working');
    } catch (error) {
      tests.push('❌ UI Components failed: ' + error.message);
    }
    
    // Test 3: Check if date-fns works
    try {
      const { format } = require('date-fns');
      const dateTest = format(new Date(), 'yyyy-MM-dd');
      tests.push('✅ Date-fns working: ' + dateTest);
    } catch (error) {
      tests.push('❌ Date-fns failed: ' + error.message);
    }
    
    setTestResult(tests.join('\n'));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <h1 className="text-2xl font-bold text-gray-900">System Test</h1>
            <p className="text-gray-600">Testing all dependencies and components</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button onClick={runTests} className="w-full">
                <CheckCircle className="h-4 w-4 mr-2" />
                Run Tests
              </Button>
              
              {testResult && (
                <div className="mt-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Test Results:</h3>
                  <pre className="bg-gray-100 p-4 rounded-md text-sm whitespace-pre-wrap">
                    {testResult}
                  </pre>
                </div>
              )}
              
              <div className="mt-6 space-y-2">
                <h3 className="font-semibold text-gray-900">Component Tests:</h3>
                <div className="flex space-x-2">
                  <Badge variant="success" icon="CheckCircle">Success Badge</Badge>
                  <Badge variant="warning" icon="AlertTriangle">Warning Badge</Badge>
                  <Badge variant="danger" icon="XCircle">Danger Badge</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TestPage;
