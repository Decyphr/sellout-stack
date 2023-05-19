import { Link } from "@remix-run/react";

type SimpleCardProps = {
  title: string;
  link: string;
};

const SimpleCard = ({ title, link }: SimpleCardProps) => {
  return (
    <Link
      to={link}
      className="flex-1 p-4 rounded-sm md:p-8 bg-foreground/10 transition-colors hover:bg-foreground/20 hover:border-emerald-500 focus:border-emerald-500 border border-transparent"
    >
      {title}
    </Link>
  );
};

export { SimpleCard };
