import { Link } from "@remix-run/react";

type SimpleCardProps = {
  title: string;
  link: string;
};

const SimpleCard = ({ title, link }: SimpleCardProps) => {
  return (
    <Link
      to={link}
      className="flex-1 p-4 md:p-8 bg-foreground/10 transition-colors hover:bg-foreground/20"
    >
      {title}
    </Link>
  );
};

export { SimpleCard };
