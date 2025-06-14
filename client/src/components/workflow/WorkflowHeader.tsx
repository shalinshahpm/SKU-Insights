import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  Activity, 
  Target, 
  AlertTriangle, 
  CheckCircle, 
  RotateCcw 
} from 'lucide-react';

interface WorkflowStep {
  id: number;
  title: string;
  icon: React.ReactNode;
  status: 'completed' | 'active' | 'pending';
  description: string;
}

export function WorkflowHeader() {
  const steps: WorkflowStep[] = [
    {
      id: 1,
      title: 'Upload SKUs',
      icon: <Upload className="h-4 w-4" />,
      status: 'completed',
      description: 'Import product data'
    },
    {
      id: 2,
      title: 'Pulse Check',
      icon: <Activity className="h-4 w-4" />,
      status: 'active',
      description: 'Monitor velocity & reviews'
    },
    {
      id: 3,
      title: 'Sentiment Analysis',
      icon: <Target className="h-4 w-4" />,
      status: 'pending',
      description: 'Consumer sentiment tracking'
    },
    {
      id: 4,
      title: 'Benchmarks',
      icon: <CheckCircle className="h-4 w-4" />,
      status: 'pending',
      description: 'Category comparison'
    },
    {
      id: 5,
      title: 'Actions & Alerts',
      icon: <AlertTriangle className="h-4 w-4" />,
      status: 'pending',
      description: 'Intervention recommendations'
    },
    {
      id: 6,
      title: 'Learning Loop',
      icon: <RotateCcw className="h-4 w-4" />,
      status: 'pending',
      description: 'Outcome tracking'
    }
  ];

  const getStepColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'active':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const getConnectorColor = (currentStatus: string, nextStatus: string) => {
    if (currentStatus === 'completed') return 'bg-green-300';
    if (currentStatus === 'active' && nextStatus === 'pending') return 'bg-blue-300';
    return 'bg-gray-300';
  };

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900">SKU Launch Flywheel</h2>
          <p className="text-sm text-gray-600">6-step workflow for successful product launches</p>
        </div>
        
        <div className="relative">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                {/* Step */}
                <div className="flex flex-col items-center">
                  <div className={`
                    relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-2 
                    ${getStepColor(step.status)}
                  `}>
                    {step.icon}
                  </div>
                  <div className="mt-2 text-center">
                    <p className="text-xs font-medium text-gray-900">{step.title}</p>
                    <p className="text-xs text-gray-500 max-w-20">{step.description}</p>
                    <Badge 
                      variant="outline" 
                      className={`mt-1 text-xs ${getStepColor(step.status)}`}
                    >
                      {step.status}
                    </Badge>
                  </div>
                </div>
                
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className={`
                    flex-1 h-0.5 mx-4 
                    ${getConnectorColor(step.status, steps[index + 1].status)}
                  `} />
                )}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}