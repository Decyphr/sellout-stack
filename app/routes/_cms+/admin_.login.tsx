import { Button } from "@cms/components/ui/button";
import { Checkbox } from "@cms/components/ui/checkbox";
import { Input } from "@cms/components/ui/input";
import { Label } from "@cms/components/ui/label";
import {
  ActionArgs,
  LoaderArgs,
  V2_MetaFunction,
  json,
  redirect,
} from "@remix-run/node";
import { Link, useSearchParams } from "@remix-run/react";
import { makeDomainFunction } from "domain-functions";
import { LayersIcon } from "lucide-react";
import { performMutation } from "remix-forms";
import { z } from "zod";
import { Form } from "~/form";
import { verifyLogin } from "~/models/user.server";
import { createUserSession, getUserId } from "~/session.server";

const schema = z.object({
  email: z.string().min(1).email(),
  password: z.string().min(8),
  redirectTo: z.string(),
  remember: z.string(),
});

const mutation = makeDomainFunction(schema)(async (values) => {
  const user = await verifyLogin(values.email, values.password);
  if (!user) throw "Invalid email or password";

  return { ...values, userId: user.id };
});

export const loader = async ({ request }: LoaderArgs) => {
  const userId = await getUserId(request);
  if (userId) return redirect("/admin");
  return json({});
};

export const action = async ({ request }: ActionArgs) => {
  const result = await performMutation({ request, schema, mutation });

  if (!result.success) return json(result, { status: 400 });

  return createUserSession({
    redirectTo: result.data.redirectTo || "/admin",
    remember: result.data.remember === "on" ? true : false,
    request,
    userId: result.data.userId,
  });
};

export const meta: V2_MetaFunction = () => [{ title: "Login" }];

export default function LoginRoute() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/admin";

  return (
    <div className="flex min-h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="mb-4 flex justify-center items-center space-x-4">
          <LayersIcon className="w-10 h-10" />
          <h2 className="text-5xl font-thin leading-9 tracking-tight text-foreground dark:text-white">
            Forge
            <span className="font-normal">CMS</span>
          </h2>
        </div>
      </div>
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <Form className="space-y-4 w-full" schema={schema}>
          {({ Field, Errors, register }) => (
            <>
              <Field name="email">
                {({ Errors }) => (
                  <div className="space-y-2">
                    <Label htmlFor="email" className="mb-2">
                      Email
                    </Label>
                    <Input {...register("email")} />
                    <Errors className="text-red-500" />
                  </div>
                )}
              </Field>
              <Field name="password">
                {({ Errors }) => (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      <div className="text-sm">
                        <Link
                          to="/forgot-password"
                          className="font-semibold transition-colors text-emerald-500 hover:text-emerald-400"
                        >
                          Forgot password?
                        </Link>
                      </div>
                    </div>
                    <Input {...register("password")} type="password" />
                    <Errors className="text-red-500" />
                  </div>
                )}
              </Field>
              <Button type="submit" className="w-full h-12">
                Sign In
              </Button>
              <Field name="remember">
                {({ Errors }) => (
                  <div className="flex items-center space-x-2">
                    <Checkbox id="remember" {...register("remember")} />
                    <label
                      htmlFor="remember"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Remember Me
                    </label>
                  </div>
                )}
              </Field>
              <Field name="redirectTo">
                {({ Errors }) => (
                  <>
                    <input
                      type="hidden"
                      defaultValue={redirectTo}
                      {...register("redirectTo")}
                    />
                    <Errors className="text-red-500" />
                  </>
                )}
              </Field>
              <Errors />
            </>
          )}
        </Form>
      </div>
    </div>
  );
}
