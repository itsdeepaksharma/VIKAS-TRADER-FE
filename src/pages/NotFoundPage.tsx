import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <section className="rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-200">
      <h1 className="text-2xl font-semibold text-slate-900">Page not found</h1>
      <p className="mt-2 text-slate-600">The page you requested does not exist.</p>
      <Link to="/" className="mt-6 inline-block rounded-lg bg-blue-600 px-4 py-2 text-white">
        Go home
      </Link>
    </section>
  );
}
