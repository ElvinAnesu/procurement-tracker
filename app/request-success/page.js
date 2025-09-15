'use client';

import { useSearchParams } from 'next/navigation';
import { CheckCircle, Copy, FileText, ArrowRight } from 'lucide-react';
import Card, { CardHeader, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Link from 'next/link';
import { Suspense } from 'react';

const RequestSuccessContent = () => {
  const searchParams = useSearchParams();
  const reqNumber = searchParams.get('reqNumber');

  const handleCopyRequisitionNumber = () => {
    navigator.clipboard.writeText(reqNumber);
    // You could add a toast notification here
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <Card>
          <CardContent className="p-8 text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Request Submitted Successfully!
            </h1>
            
            <p className="text-gray-600 mb-6">
              Your procurement request has been submitted and is now being processed.
            </p>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600 mb-2">Your Requisition Number:</p>
              <div className="flex items-center justify-center space-x-2">
                <code className="text-lg font-mono font-semibold text-gray-900">
                  {reqNumber}
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopyRequisitionNumber}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                <strong>What happens next?</strong>
              </p>
              <ul className="text-sm text-gray-600 space-y-2 text-left">
                <li className="flex items-start">
                  <ArrowRight className="h-4 w-4 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                  Your request will be assigned to a procurement officer
                </li>
                <li className="flex items-start">
                  <ArrowRight className="h-4 w-4 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                  You&apos;ll receive email updates at each stage
                </li>
                <li className="flex items-start">
                  <ArrowRight className="h-4 w-4 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                  You can track progress using your requisition number
                </li>
              </ul>
            </div>

            <div className="mt-8 space-y-3">
              <Link href="/dashboard" className="block">
                <Button className="w-full">
                  <FileText className="h-4 w-4 mr-2" />
                  Go to Dashboard
                </Button>
              </Link>
              
              <Link href="/track" className="block">
                <Button variant="outline" className="w-full">
                  Track This Request
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const RequestSuccessPage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <RequestSuccessContent />
    </Suspense>
  );
};

export default RequestSuccessPage;
