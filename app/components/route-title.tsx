import { Link, useLocation } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";

type RouteTitleProps = {
  title: string;
  children?: React.ReactNode;
};

const RouteTitle = ({ title, children }: RouteTitleProps) => {
  const { pathname } = useLocation();

  const breadcrumbs = pathname.split("/");

  const backLink =
    breadcrumbs.length > 1
      ? {
          label: breadcrumbs[breadcrumbs.length - 2].replace(/[^\w\s]/gi, " "),
          href: breadcrumbs.slice(0, -1).join("/"),
        }
      : {};

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="divide-x-2">
            {backLink.href ? (
              <Link to={backLink.href}>
                <Button
                  onClick={() => console.log(breadcrumbs)}
                  variant="ghost"
                  size="sm"
                  className="capitalize"
                >
                  {backLink.label}
                </Button>
              </Link>
            ) : null}
          </div>
          <h2 className="scroll-m-20 text-4xl font-medium text-foreground lg:text-5xl">
            {title}
          </h2>
        </div>
        <div className="flex space-x-4">{children}</div>
      </div>
      <Separator className="my-8" />
    </>
  );
};

export { RouteTitle };
