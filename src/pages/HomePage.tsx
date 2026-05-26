import { LoadingSpinner } from '../components/LoadingSpinner';
import { useHealth } from '../hooks/useHealth';

export function HomePage() {
  const { data, isLoading, isError } = useHealth();

  return (
    <section className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
      <p className="text-sm font-medium uppercase tracking-wide text-blue-600">Full-stack starter</p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
        Production-ready Vikas Trader base
      </h1>
      <p className="mt-4 max-w-2xl text-slate-600">
        React, FastAPI, PostgreSQL, SQLAlchemy, Alembic, Docker, and clean architecture
        foundations are ready for feature development.
      </p>

      <div className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-5">
        <h2 className="text-base font-semibold text-slate-900">Backend health</h2>
        <div className="mt-3 text-sm text-slate-700">
          {isLoading && <LoadingSpinner />}
          {isError && <span className="text-red-600">Unable to reach the API.</span>}
          {data && (
            <span>
              {data.service} is <strong>{data.status}</strong> in {data.environment}.
            </span>
          )}
        </div>
      </div>
    </section>
  );
}
