import { useFullPageLoading } from '@/context/FullPageLoadingContext';
import Spinner from './spinner';

export default function FullPageSpinner() {
  const { FullPageloading } = useFullPageLoading();

  return (
    FullPageloading && (
      <div style={styles.loaderOverlay}>
        <Spinner />
      </div>
    )
  );
}

// Inline styles with type definition
const styles: {
  loaderOverlay: React.CSSProperties;
} = {
  loaderOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'rgba(255, 255, 255, 0.6)', // Slight transparent background
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
};
