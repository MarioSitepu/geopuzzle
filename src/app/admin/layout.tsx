import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // Note: For now, if someone is logged in, we let them view it, or we can check role.
  // We'll enforce a strict check if they have the role "ADMIN" (if implemented later) or just being logged in.
  // For safety, let's at least ensure they are logged in.
  if (!session) {
    redirect('/login');
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-white border-r">
        <div className="p-4 font-bold text-xl border-b">Geopuzzle Admin</div>
        <nav className="p-4 space-y-2">
          <Link href="/admin" className="block p-2 rounded hover:bg-gray-50">
            Dashboard
          </Link>
          <Link href="/admin/users" className="block p-2 rounded hover:bg-gray-50">
            Users
          </Link>
          <Link href="/admin/history" className="block p-2 rounded hover:bg-gray-50">
            Quiz History
          </Link>
          <Link href="/" className="block p-2 rounded hover:bg-gray-50 text-blue-500 mt-4">
            ← Back to App
          </Link>
        </nav>
      </aside>
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
