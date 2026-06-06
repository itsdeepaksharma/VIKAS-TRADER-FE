import { FormEvent, useEffect, useRef, useState, type ReactNode } from 'react';
import { Loader2, Search } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

import { useProducts } from '../../hooks/useCatalog';
import { cn, formatCurrency } from '../../lib/utils';

type SearchBarProps = {
  placeholder?: string;
  className?: string;
  value?: string;
  onChange?: (value: string) => void;
  onSearch?: (query: string) => void;
  enableSuggestions?: boolean;
  layout?: 'default' | 'home';
  topAction?: ReactNode;
};

export function SearchBar({
  placeholder = 'Search plasticware, containers...',
  className,
  value = '',
  onChange,
  onSearch,
  enableSuggestions = true,
  layout = 'default',
  topAction,
}: SearchBarProps) {
  const navigate = useNavigate();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [debouncedQ, setDebouncedQ] = useState('');
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedQ(value.trim()), 300);
    return () => window.clearTimeout(timer);
  }, [value]);

  const showDropdown = enableSuggestions && focused && debouncedQ.length >= 2;

  const { data: suggestions = [], isFetching } = useProducts(
    showDropdown ? { q: debouncedQ } : undefined,
    { enabled: showDropdown },
  );

  useEffect(() => {
    function onPointerDown(e: MouseEvent) {
      if (!wrapperRef.current?.contains(e.target as Node)) setFocused(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, []);

  function submit(e: FormEvent) {
    e.preventDefault();
    const q = value.trim();
    if (!q) return;
    setFocused(false);
    onSearch?.(q);
  }

  function goToSearch(q: string) {
    setFocused(false);
    onSearch?.(q);
    if (!onSearch) navigate(`/search?q=${encodeURIComponent(q)}`);
  }

  const isHomeLayout = layout === 'home';

  return (
    <div ref={wrapperRef} className={cn('relative', className)}>
      <form
        onSubmit={submit}
        className={cn(isHomeLayout ? 'flex items-stretch gap-2' : 'relative')}
      >
        {isHomeLayout ? (
          <>
            <div className="relative min-w-0 flex-1">
              <input
                type="search"
                value={value}
                onChange={(e) => onChange?.(e.target.value)}
                onFocus={() => setFocused(true)}
                placeholder={placeholder}
                autoComplete="off"
                className="h-12 w-full rounded-2xl border border-vt-border bg-vt-surface pl-4 pr-14 text-sm shadow-sm transition-shadow focus:border-vt-blue focus:outline-none focus:ring-2 focus:ring-vt-blue/20"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-xl bg-vt-gradient text-white shadow-sm"
                aria-label="Search"
              >
                <Search className="h-4 w-4" />
              </button>
            </div>
            {topAction ? (
              <div className="flex shrink-0 flex-col justify-center">{topAction}</div>
            ) : null}
          </>
        ) : (
          <>
            <input
              type="search"
              value={value}
              onChange={(e) => onChange?.(e.target.value)}
              onFocus={() => setFocused(true)}
              placeholder={placeholder}
              autoComplete="off"
              className="h-12 w-full rounded-2xl border border-vt-border bg-vt-surface pl-4 pr-14 text-sm shadow-sm transition-shadow focus:border-vt-blue focus:outline-none focus:ring-2 focus:ring-vt-blue/20"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-xl bg-vt-gradient text-white shadow-sm"
              aria-label="Search"
            >
              <Search className="h-4 w-4" />
            </button>
          </>
        )}
      </form>

      {showDropdown && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-vt-border bg-vt-surface shadow-elevated">
          {isFetching && (
            <div className="flex items-center gap-2 px-4 py-3 text-sm text-vt-muted">
              <Loader2 className="h-4 w-4 animate-spin" />
              Searching...
            </div>
          )}
          {!isFetching && suggestions.length === 0 && (
            <p className="px-4 py-3 text-sm text-vt-muted">No products found</p>
          )}
          {!isFetching &&
            suggestions.slice(0, 8).map((product) => (
              <Link
                key={product.id}
                to={`/products/${product.id}`}
                onClick={() => setFocused(false)}
                className="flex items-center gap-3 border-b border-slate-50 px-3 py-2.5 last:border-0 hover:bg-vt-surface-muted"
              >
                <img
                  src={product.image}
                  alt=""
                  className="h-11 w-11 shrink-0 rounded-xl object-cover bg-slate-100"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-vt-foreground">{product.name}</p>
                  <p className="text-xs font-semibold text-vt-blue">
                    {formatCurrency(product.price)}
                    {!product.inStock && <span className="ml-2 text-red-500">Out of stock</span>}
                  </p>
                </div>
              </Link>
            ))}
          {!isFetching && suggestions.length > 0 && (
            <button
              type="button"
              onClick={() => goToSearch(debouncedQ)}
              className="w-full py-2.5 text-center text-sm font-semibold text-vt-blue hover:bg-vt-surface-muted"
            >
              See all results for &quot;{debouncedQ}&quot;
            </button>
          )}
        </div>
      )}
    </div>
  );
}
