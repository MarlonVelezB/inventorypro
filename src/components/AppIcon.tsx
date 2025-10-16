import * as LucideIcons from 'lucide-react';
import { HelpCircle, type LucideIcon } from 'lucide-react';
import type { IconProps } from '../types/component.types';

const Icon: React.FC<IconProps> = ({
    name,
    size = 24,
    color = "currentColor",
    className = "",
    strokeWidth = 2,
    ...props
}) => {
    const IconComponent = LucideIcons[name] as LucideIcon;

    if (!IconComponent) {
        return <HelpCircle size={size} color="gray" strokeWidth={strokeWidth} className={className} {...props} />;
    }

    return <IconComponent
        size={size}
        color={color}
        strokeWidth={strokeWidth}
        className={className}
        {...props}
    />;
}

export default Icon;