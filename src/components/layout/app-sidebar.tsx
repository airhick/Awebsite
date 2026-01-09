import { useLayout } from '@/context/layout-provider'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'
import { sidebarData } from './data/sidebar-data'
import { NavGroup } from './nav-group'
import { NavUser } from './nav-user'

export function AppSidebar() {
  const { collapsible, variant } = useLayout()
  return (
    <Sidebar collapsible={collapsible} variant={variant}>
      <SidebarHeader>
        <div className="logo" style={{ fontSize: 0, lineHeight: 0 }}>
          <img 
            src="/logos/aurora-logo.png" 
            alt="Aurora Logo" 
            className="h-7 object-contain"
            style={{ width: 'auto', display: 'block' }}
          />
        </div>
      </SidebarHeader>
      <SidebarContent>
        {sidebarData.navGroups.map((props, index) => (
          <NavGroup key={props.title || `nav-group-${index}`} {...props} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
