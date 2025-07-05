import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { testFirebaseConnection } from '@/lib/firebase/test';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function FirebaseTest() {
  const [testResults, setTestResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const runTest = async () => {
    setIsLoading(true);
    try {
      const results = await testFirebaseConnection();
      setTestResults(results);
    } catch (error) {
      console.error('Test failed:', error);
    }
    setIsLoading(false);
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Firebase Configuration Test</CardTitle>
          <CardDescription>
            Test your Firebase configuration by checking Authentication, Firestore, and Storage functionality
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button 
              onClick={runTest} 
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Running Tests...' : 'Run Firebase Tests'}
            </Button>

            {testResults && (
              <div className="mt-6 space-y-4">
                <h3 className="text-lg font-semibold">Test Results:</h3>
                
                <div className="grid gap-4">
                  {/* Authentication Status */}
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Authentication</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Tests anonymous sign-in and sign-out
                      </p>
                    </div>
                    <div className={`px-3 py-1 rounded-full ${
                      testResults.auth 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {testResults.auth ? 'Working' : 'Failed'}
                    </div>
                  </div>

                  {/* Firestore Status */}
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Firestore</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Tests document creation, querying, and deletion
                      </p>
                    </div>
                    <div className={`px-3 py-1 rounded-full ${
                      testResults.firestore 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {testResults.firestore ? 'Working' : 'Failed'}
                    </div>
                  </div>

                  {/* Storage Status */}
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Storage</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Tests file upload, download URL generation, and deletion
                      </p>
                    </div>
                    <div className={`px-3 py-1 rounded-full ${
                      testResults.storage 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {testResults.storage ? 'Working' : 'Failed'}
                    </div>
                  </div>
                </div>

                {/* Error Display */}
                {testResults.errors.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-red-600 dark:text-red-400">Errors:</h3>
                    <div className="mt-2 space-y-2">
                      {testResults.errors.map((error, index) => (
                        <div 
                          key={index}
                          className="p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg"
                        >
                          <p className="font-medium text-red-700 dark:text-red-400">
                            {error.service}
                          </p>
                          <p className="text-sm text-red-600 dark:text-red-300">
                            {error.error}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 