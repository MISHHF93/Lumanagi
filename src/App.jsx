import './App.css';
import Pages from '@/pages/index.jsx';
import { Toaster } from '@/components/ui/toaster';
import { useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';

function App() {
  const fetchUser = useAppStore((state) => state.fetchUser);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <>
      <Pages />
      <Toaster />
    </>
  );
}

export default App;
