
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { db } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User as UserIcon, Mail, Calendar, BookOpen, ShieldCheck, CheckCircle, XCircle } from 'lucide-react';

export default function UserProfile() {
  const router = useRouter();
  const { id } = router.query;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchUser = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, 'users', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUser({ id: docSnap.id, ...docSnap.data() });
        } else {
          setUser(null);
        }
      } catch (error) {
        setUser(null);
      }
      setLoading(false);
    };
    fetchUser();
  }, [id]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">User not found.</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
      <Card className="max-w-xl w-full p-8 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col items-center gap-4 mb-8">
          <div className="h-20 w-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-4xl font-bold text-white shadow-lg">
            {user.name?.charAt(0)?.toUpperCase() || <UserIcon className="w-10 h-10" />}
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{user.name || 'No Name'}</h2>
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
            <Mail className="w-4 h-4" />
            <span>{user.email}</span>
          </div>
          <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${user.role === 'Instructor' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'}`}>
            {user.role}
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-blue-500 dark:text-blue-400" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Status:</span>
            <span className={`font-semibold text-sm ${user.status === 'active' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>{user.status}</span>
          </div>
          <div className="flex items-center gap-3">
            <BookOpen className="w-5 h-5 text-purple-500 dark:text-purple-400" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Courses Enrolled:</span>
            <span className="font-semibold text-sm text-gray-900 dark:text-gray-100">{user.coursesEnrolled || 0}</span>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-orange-500 dark:text-orange-400" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Joined:</span>
            <span className="font-semibold text-sm text-gray-900 dark:text-gray-100">{user.joinedDate ? new Date(user.joinedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}</span>
          </div>
          <div className="flex items-center gap-3">
            {user.status === 'active' ? <CheckCircle className="w-5 h-5 text-green-500 dark:text-green-400" /> : <XCircle className="w-5 h-5 text-red-500 dark:text-red-400" />}
            <span className="text-sm text-gray-600 dark:text-gray-400">Account:</span>
            <span className="font-semibold text-sm text-gray-900 dark:text-gray-100">{user.status === 'active' ? 'Active' : 'Inactive'}</span>
          </div>
        </div>
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Additional Details</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">User ID:</span>
              <span className="font-mono text-xs text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">{user.id}</span>
            </div>
            {/* Add more custom fields here if available, e.g. phone, address, etc. */}
          </div>
        </div>
        <div className="flex justify-end">
          <Button variant="outline" onClick={() => router.back()}>
            Back
          </Button>
        </div>
      </Card>
    </div>
  );
}
