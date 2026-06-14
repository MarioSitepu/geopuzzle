import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';


export default async function AdminDashboard() {
  const userCount = await prisma.user.count();
  const historyCount = await prisma.quizHistory.count();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow border">
          <h2 className="text-xl font-semibold mb-2">Total Users</h2>
          <p className="text-4xl font-bold text-blue-600">{userCount}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border">
          <h2 className="text-xl font-semibold mb-2">Total Quizzes Taken</h2>
          <p className="text-4xl font-bold text-green-600">{historyCount}</p>
        </div>
      </div>
    </div>
  );
}
