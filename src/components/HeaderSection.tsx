
interface HeaderSectionProps {
    title: string;
    sectionDescription: string;
}

const HeaderSection: React.FC<HeaderSectionProps> = ({title, sectionDescription}) => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground">
        {title}
      </h1>
      <p className="text-muted-foreground mt-1">
        {sectionDescription}
      </p>
    </div>
  );
};

export default HeaderSection;
