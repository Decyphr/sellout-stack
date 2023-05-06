import { Separator } from "~/components/ui/separator";

type RouteTitleProps = {
  title: string;
  children?: React.ReactNode;
};

const RouteTitle = ({ title, children }: RouteTitleProps) => {
  return (
    <>
      <div className="flex items-center justify-between">
        <h2 className="scroll-m-20 text-4xl font-medium text-foreground lg:text-5xl">
          {title}
        </h2>
        <div className="space-x-4">{children}</div>
      </div>
      <Separator className="my-8" />
    </>
  );
};

export { RouteTitle };
