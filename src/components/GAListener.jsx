import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageview } from '../analytics';

export default function GAListener() {
  const location = useLocation();
  useEffect(() => {
    trackPageview(location.pathname + location.search);
  }, [location]);
  return null;
}
