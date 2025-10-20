import type { IconName } from "../types/component.types";
import Icon from "./AppIcon";

export interface InfoCardProps {
  key: string;
  showIcon: boolean;
  iconName?: IconName;
  iconColor?: "primary" | "secondary" | "accent" | "success";
  titleCard: string;
  cardInfo: string | number;
}

const InfoCard: React.FC<InfoCardProps> = ({
  showIcon,
  iconName = "Info",
  iconColor = 'primary',
  titleCard,
  cardInfo
}) => {

  const getColorIcon = (color: string) => {
    switch (color) {
      case "primary":
        return 'text-[#3b82f6]';
      case "secondary":
        return 'text-[#6366f1]';
      case "accent":
        return 'text-[#f59e0b]';
      case "success":
        return 'text-[#10b981]';
    }
  };
  return (
    <div className="bg-(--color-card) border border-border rounded-lg p-4">
      <div className="flex items-center space-x-3">
        {showIcon && (
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon
              name={iconName}
              size={20}
              className={`${getColorIcon(iconColor)}`}
            />
          </div>
        )}
        <div>
          <p className="text-sm text-muted-foreground">{titleCard}</p>
          <p className="font-semibold text-foreground">{cardInfo}</p>
        </div>
      </div>
    </div>
  );
};

export default InfoCard;
