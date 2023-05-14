import { Separator } from "@cms/components/ui/separator";
import { Link } from "@remix-run/react";
import { ArrowLeftIcon } from "lucide-react";

type RouteTitleProps = {
  title: string;
  backLink?: string;
  children?: React.ReactNode;
};

const RouteTitle = ({ title, backLink, children }: RouteTitleProps) => {
  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {backLink ? (
            <Link
              to={backLink}
              className="text-foreground border border-foreground p-1 hover:bg-foreground hover:text-background transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5" />
            </Link>
          ) : null}
          <h2 className="scroll-m-20 text-4xl font-medium text-foreground lg:text-5xl">
            {title}
          </h2>
        </div>
        <div className="space-x-4">{children}</div>
      </div>
      <Separator className="my-8" />
    </>
  );
};

export { RouteTitle };
