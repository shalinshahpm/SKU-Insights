import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface UploadResult {
  fileName: string;
  recordsProcessed: number;
  status: 'completed' | 'error';
  message?: string;
}

export function SKUUploader() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/upload-skus', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Upload failed');
      }
      
      return response.json();
    },
    onSuccess: (data: UploadResult) => {
      setUploadResult(data);
      setUploadProgress(100);
      queryClient.invalidateQueries({ queryKey: ['/api/skus'] });
      toast({
        title: 'Upload Successful',
        description: `Processed ${data.recordsProcessed} SKUs`,
      });
    },
    onError: (error: Error) => {
      setUploadResult({
        fileName: '',
        recordsProcessed: 0,
        status: 'error',
        message: error.message,
      });
      toast({
        title: 'Upload Failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    const file = files[0];
    
    if (file && (file.type === 'text/csv' || file.name.endsWith('.xlsx') || file.name.endsWith('.xls'))) {
      processFile(file);
    } else {
      toast({
        title: 'Invalid file type',
        description: 'Please upload a CSV or Excel file',
        variant: 'destructive',
      });
    }
  }, [toast]);

  const processFile = (file: File) => {
    setUploadProgress(0);
    setUploadResult(null);
    
    // Simulate progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    uploadMutation.mutate(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          SKU Upload Center
        </CardTitle>
        <CardDescription>
          Upload your SKU data via CSV or Excel file. Data will be auto-tagged by category, market, and format.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Upload Area */}
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onDragEnter={() => setIsDragActive(true)}
          onDragLeave={() => setIsDragActive(false)}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-blue-400 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onClick={() => document.getElementById('file-input')?.click()}
        >
          <input
            id="file-input"
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileSelect}
            className="hidden"
          />
          <FileSpreadsheet className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          {isDragActive ? (
            <p className="text-blue-600">Drop your file here...</p>
          ) : (
            <div>
              <p className="text-gray-600 mb-2">
                Drag & drop your SKU file here, or click to browse
              </p>
              <p className="text-sm text-gray-500">
                Supports CSV, Excel (.xlsx, .xls) • Max file size: 10MB
              </p>
            </div>
          )}
        </div>

        {/* Required Columns Info */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium mb-2">Required Columns:</h4>
          <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
            <div>• Name</div>
            <div>• Brand</div>
            <div>• Category</div>
            <div>• Region</div>
            <div>• Market</div>
            <div>• Price (optional)</div>
            <div>• Format (optional)</div>
            <div>• Launch Date (optional)</div>
          </div>
        </div>

        {/* Upload Progress */}
        {uploadMutation.isPending && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Processing...</span>
              <span>{uploadProgress}%</span>
            </div>
            <Progress value={uploadProgress} className="h-2" />
          </div>
        )}

        {/* Upload Result */}
        {uploadResult && (
          <div className={`p-4 rounded-lg flex items-start gap-3 ${
            uploadResult.status === 'completed' 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-red-50 border border-red-200'
          }`}>
            {uploadResult.status === 'completed' ? (
              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            )}
            <div>
              <p className={`font-medium ${
                uploadResult.status === 'completed' ? 'text-green-800' : 'text-red-800'
              }`}>
                {uploadResult.status === 'completed' ? 'Upload Successful' : 'Upload Failed'}
              </p>
              <p className={`text-sm ${
                uploadResult.status === 'completed' ? 'text-green-600' : 'text-red-600'
              }`}>
                {uploadResult.status === 'completed' 
                  ? `Successfully processed ${uploadResult.recordsProcessed} SKUs`
                  : uploadResult.message
                }
              </p>
            </div>
          </div>
        )}

        {/* Sample Template Download */}
        <div className="flex justify-between items-center pt-4 border-t">
          <span className="text-sm text-gray-600">Need a template?</span>
          <Button variant="outline" size="sm">
            Download Sample CSV
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}