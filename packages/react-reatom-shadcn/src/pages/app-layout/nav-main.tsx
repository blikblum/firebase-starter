import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

export type AppSidebarNavItem = {
  label: string
  to: string
  icon?: React.ReactNode
  isActive?: boolean
}

export type AppSidebarLinkProps = {
  to: string
  className?: string
  children?: React.ReactNode
  'aria-current'?: 'page'
}

export type AppSidebarLinkRenderer = (props: AppSidebarLinkProps) => React.ReactElement

const defaultRenderLink: AppSidebarLinkRenderer = ({ to, ...props }) => {
  return <a href={to} {...props} />
}

export function NavMain({
  items,
  renderLink = defaultRenderLink,
}: {
  items: AppSidebarNavItem[]
  renderLink?: AppSidebarLinkRenderer
}): React.JSX.Element {
  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.to}>
            <SidebarMenuButton
              render={renderLink({
                to: item.to,
                'aria-current': item.isActive ? 'page' : undefined,
              })}
              isActive={item.isActive}
              tooltip={item.label}
            >
              {item.icon}
              <span>{item.label}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
