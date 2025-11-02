import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { 
  LayoutDashboard, 
  BookOpen, 
  Brain, 
  Dumbbell, 
  Award, 
  TrendingUp, 
  Settings, 
  LogOut 
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

const navigationItems = [
  { key: 'dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { key: 'journal', icon: BookOpen, path: '/journal' },
  { key: 'zenora', icon: Brain, path: '/zenora' },
  { key: 'exercises', icon: Dumbbell, path: '/exercises' },
  { key: 'rewards', icon: Award, path: '/rewards' },
  { key: 'insights', icon: TrendingUp, path: '/insights' },
  { key: 'settings', icon: Settings, path: '/settings' },
];

export function AppSidebar() {
  const { t } = useTranslation();
  const { state } = useSidebar();
  const location = useLocation();
  const { signOut } = useAuth();
  
  const isActive = (path: string) => location.pathname === path;
  const isCollapsed = state === 'collapsed';

  return (
    <Sidebar className={`${isCollapsed ? 'w-16' : 'w-64'} glass border-r border-border/20`}>
      <SidebarContent>
        {/* App Header */}
        <div className="p-4 border-b border-border/20">
          <motion.div
            animate={{ scale: isCollapsed ? 0.8 : 1 }}
            className="flex items-center space-x-3"
          >
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col"
              >
                <span className="font-bold text-lg bg-gradient-primary bg-clip-text text-transparent">
                  {t('app.name')}
                </span>
                <span className="text-xs text-muted-foreground">{t('app.tagline')}</span>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs text-muted-foreground px-4 py-2">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.key}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.path}
                      className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-all duration-200 ${
                        isActive(item.path)
                          ? 'bg-primary/10 text-primary border-r-2 border-primary'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                      }`}
                    >
                      <item.icon className={`w-5 h-5 ${isActive(item.path) ? 'text-primary' : ''}`} />
                      {!isCollapsed && (
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="font-medium"
                        >
                          {t(`nav.${item.key}`)}
                        </motion.span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Sign Out Button */}
        <div className="mt-auto p-4 border-t border-border/20">
          <Button
            variant="ghost"
            className="w-full justify-start text-muted-foreground hover:text-foreground"
            onClick={() => signOut()}
          >
            <LogOut className="w-5 h-5 mr-3" />
            {!isCollapsed && t('auth.signOut')}
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}