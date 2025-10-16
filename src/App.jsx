import './App.css'
import Pages from "@/pages/index.jsx"
import { Toaster } from "@/components/ui/toaster"
import { useEffect } from "react"
import { useAppStore } from "@/store/useAppStore"
import { AuthProvider } from "@/contexts/AuthProvider"  // ✅ Make sure this import exists

function App() {
  const fetchUser = useAppStore((state) => state.fetchUser);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <AuthProvider>
      <Pages />
      <Toaster />
    </AuthProvider>
  )
}

export default App