'use client';

import { CheckCircle, Clock, XCircle } from 'lucide-react';
import { REQUEST_STATUS, getStatusDisplayInfo } from '../data/mockData';
import Badge from './ui/Badge';

const StatusTracker = ({ request, className = '' }) => {
  const statusOrder = [
    REQUEST_STATUS.PENDING,
    REQUEST_STATUS.ASSIGNED,
    REQUEST_STATUS.PRODUCT_SOURCING,
    REQUEST_STATUS.CREATE_PO,
    REQUEST_STATUS.FINANCE_APPROVAL,
    REQUEST_STATUS.MD_APPROVAL,
    REQUEST_STATUS.PO_PAYMENT,
    REQUEST_STATUS.DELIVERY,
    REQUEST_STATUS.COMPLETED
  ];

  const currentStatusIndex = statusOrder.indexOf(request.status);
  const isDeclined = request.status === REQUEST_STATUS.DECLINED;
  const isCancelled = request.status === REQUEST_STATUS.CANCELLED;

  return (
    <div className={`space-y-3 sm:space-y-4 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900">Request Status</h3>
        <Badge 
          variant={isDeclined || isCancelled ? 'danger' : 'info'}
          icon={getStatusDisplayInfo(request.status).icon}
          className="self-start sm:self-auto"
        >
          {getStatusDisplayInfo(request.status).label}
        </Badge>
      </div>
      
      <div className="relative overflow-x-auto">
        <div className="flex items-center justify-between min-w-max px-2 sm:px-0">
          {statusOrder.map((status, index) => {
            const statusInfo = getStatusDisplayInfo(status);
            const isCompleted = index < currentStatusIndex;
            const isCurrent = index === currentStatusIndex && !isDeclined && !isCancelled;
            const isUpcoming = index > currentStatusIndex;
            
            return (
              <div key={status} className="flex flex-col items-center space-y-1 sm:space-y-2 relative px-1 sm:px-0">
                <div className={`
                  w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium
                  ${isCompleted ? 'bg-green-500 text-white' : 
                    isCurrent ? 'bg-blue-500 text-white' : 
                    isUpcoming ? 'bg-gray-200 text-gray-500' : 'bg-gray-200 text-gray-500'}
                `}>
                  {isCompleted ? (
                    <CheckCircle className="w-3 h-3 sm:w-5 sm:h-5" />
                  ) : isCurrent ? (
                    <Clock className="w-3 h-3 sm:w-5 sm:h-5" />
                  ) : (
                    <span className="text-xs sm:text-sm">{index + 1}</span>
                  )}
                </div>
                <div className="text-xs text-center max-w-16 sm:max-w-20">
                  <div className={`font-medium ${isCurrent ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'}`}>
                    <span className="hidden sm:inline">{statusInfo.label}</span>
                    <span className="sm:hidden">{statusInfo.label.split(' ')[0]}</span>
                  </div>
                </div>
                
                {/* Connector line */}
                {index < statusOrder.length - 1 && (
                  <div className={`
                    absolute top-3 sm:top-4 left-6 sm:left-8 w-full h-0.5 -z-10
                    ${isCompleted ? 'bg-green-500' : 'bg-gray-200'}
                  `} />
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      {(isDeclined || isCancelled) && (
        <div className="mt-3 sm:mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <div className="flex items-center">
            <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 mr-2 flex-shrink-0" />
            <span className="text-xs sm:text-sm text-red-700">
              {isDeclined ? 'This request has been declined' : 'This request has been cancelled'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatusTracker;
