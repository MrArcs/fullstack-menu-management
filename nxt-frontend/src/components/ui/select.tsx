import * as React from 'react'
import { cn } from '@/lib/utils'
import { ChevronDown } from 'lucide-react'
import {
    SelectProps,
    SelectTriggerProps,
    SelectValueProps,
    SelectContentProps,
    SelectItemProps,
} from '@/lib/types'

const Select = React.forwardRef<HTMLDivElement, SelectProps>(
    ({ className, children, ...props }, ref) => {
        return (
            <div ref={ref} className={cn('relative', className)} {...props}>
                {children}
            </div>
        )
    }
)
Select.displayName = 'Select'

const SelectTrigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(
    ({ className, children, placeholder, ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(
                    'flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
                    className
                )}
                {...props}
            >
                <span className="truncate">{children || placeholder}</span>
                <ChevronDown className="h-4 w-4 opacity-50" />
            </button>
        )
    }
)
SelectTrigger.displayName = 'SelectTrigger'

const SelectValue = ({ placeholder, children }: SelectValueProps) => {
    return <span>{children || placeholder}</span>
}

const SelectContent = React.forwardRef<HTMLDivElement, SelectContentProps>(
    ({ className, children, onOpenChange, ...props }, ref) => {
        const [isOpen, setIsOpen] = React.useState(false)
        const contentRef = React.useRef<HTMLDivElement>(null)

        React.useEffect(() => {
            const handleClickOutside = (event: MouseEvent) => {
                if (
                    contentRef.current &&
                    !contentRef.current.contains(event.target as Node)
                ) {
                    setIsOpen(false)
                    onOpenChange?.(false)
                }
            }

            if (isOpen) {
                document.addEventListener('mousedown', handleClickOutside)
            }

            return () => {
                document.removeEventListener('mousedown', handleClickOutside)
            }
        }, [isOpen, onOpenChange])

        if (!isOpen) return null

        return (
            <div
                ref={ref}
                className={cn(
                    'absolute z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md',
                    className
                )}
                {...props}
            >
                <div ref={contentRef} className="p-1">
                    {children}
                </div>
            </div>
        )
    }
)
SelectContent.displayName = 'SelectContent'

const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(
    ({ className, children, value, onSelect, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-accent hover:text-accent-foreground',
                    className
                )}
                onClick={() => onSelect?.(value)}
                {...props}
            >
                {children}
            </div>
        )
    }
)
SelectItem.displayName = 'SelectItem'

// Custom hook for select functionality
export function useSelect() {
    const [open, setOpen] = React.useState(false)
    const [value, setValue] = React.useState<string>('')

    const handleValueChange = (newValue: string) => {
        setValue(newValue)
        setOpen(false)
    }

    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen)
    }

    return {
        open,
        value,
        setValue,
        handleValueChange,
        handleOpenChange,
    }
}

export { Select, SelectContent, SelectItem, SelectTrigger, SelectValue }
