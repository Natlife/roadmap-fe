import { Suspense, type ComponentType } from 'react';
import Loader from './Loader';

// HOC that wraps a lazily-imported page in a Suspense fallback.
export default function Loadable<P extends object>(Component: ComponentType<P>) {
  return function WithLoader(props: P) {
    return (
      <Suspense fallback={<Loader />}>
        <Component {...props} />
      </Suspense>
    );
  };
}
