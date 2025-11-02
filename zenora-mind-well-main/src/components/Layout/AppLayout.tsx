import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from './AppSidebar';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';

export function AppLayout() {
  return (
    <SidebarProvider>
      <div className="min-h-screen w-full flex bg-gradient-wellness">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          {/* Top Header */}
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="h-16 glass border-b border-border/20 flex items-center px-6"
          >
            <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
          </motion.header>

          {/* Main Content */}
          <main className="flex-1 overflow-hidden">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="h-full"
            >
              <Outlet />
            </motion.div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}