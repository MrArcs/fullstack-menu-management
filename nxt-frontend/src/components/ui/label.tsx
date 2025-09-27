import * as React from 'react'
import { cn } from '@/lib/utils'
import { LabelProps } from '@/lib/types'

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
    ({ className, ...props }, ref) => {
        return (
            <label
                ref={ref}
                className={cn(
                    'flex items-center gap-2 text-sm leading-none font-medium select-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
                    className
                )}
                {...props}
            />
        )
    }
)
Label.displayName = 'Label'

export { Label }
