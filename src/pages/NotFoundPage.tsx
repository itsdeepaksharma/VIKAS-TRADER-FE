import { Link } from 'react-router-dom';

import { GradientButton } from '../components/ecommerce/GradientButton';

export function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p className="text-6xl font-bold text-vt-blue">404</p>
      <h1 className="mt-2 text-xl font-bold text-vt-dark">Page not found</h1>
      <p className="mt-2 text-slate-500">The page you&apos;re looking for doesn&apos;t exist.</p>
      <Link to="/" className="mt-6">
        <GradientButton>Back to Home</GradientButton>
      </Link>
    </div>
  );
}
