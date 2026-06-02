import { Link } from 'react-router-dom';

import { GradientButton } from '../components/ecommerce/GradientButton';

export function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p className="text-6xl font-bold text-vt-blue">404</p>
      <h1 className="mt-2 text-xl font-bold text-vt-foreground">Page not found</h1>
      <p className="mt-2 text-vt-muted">The page you&apos;re looking for doesn&apos;t exist.</p>
      <Link to="/" className="mt-6">
        <GradientButton>Back to Home</GradientButton>
      </Link>
    </div>
  );
}
