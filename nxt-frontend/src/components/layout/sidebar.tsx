'use client'

import { useState } from 'react'
import { Menu, X, Grid, Folder } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { SidebarProps } from '@/lib/types'

const navigationItems = [
    { name: 'Systems', icon: Folder, href: '#' },
    { name: 'System Code', icon: Grid, href: '#' },
    { name: 'Properties', icon: Grid, href: '#' },
    { name: 'Menus', icon: Grid, href: '/menus', active: true },
    { name: 'API List', icon: Grid, href: '#' },
    { name: 'Users & Group', icon: Folder, href: '#' },
    { name: 'Competition', icon: Folder, href: '#' },
]

export function Sidebar({ className }: SidebarProps) {
    const [collapsed, setCollapsed] = useState(false)

    return (
        <div
            className={cn(
                'flex flex-col h-full bg-sidebar text-sidebar-foreground transition-all duration-300',
                collapsed ? 'w-16' : 'w-64',
                className
            )}
        >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-sidebar-foreground/20">
                {!collapsed && (
                    <div className="flex items-center space-x-2">
                        <span className="font-bold text-lg">CLOIT</span>
                    </div>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">
                {navigationItems.map((item) => {
                    const Icon = item.icon
                    return (
                        <a
                            key={item.name}
                            href={item.href}
                            className={cn(
                                'flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors',
                                item.active
                                    ? 'text-green-800'
                                    : 'text-sidebar-foreground hover:bg-sidebar-foreground/10'
                            )}
                            style={
                                item.active
                                    ? { backgroundColor: '#9FF443' }
                                    : {}
                            }
                        >
                            <Icon className="h-4 w-4 flex-shrink-0" />
                            {!collapsed && (
                                <span className="text-sm font-medium">
                                    {item.name}
                                </span>
                            )}
                        </a>
                    )
                })}
            </nav>
        </div>
    )
}
