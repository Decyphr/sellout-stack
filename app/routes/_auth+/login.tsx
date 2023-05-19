import {
  json,
  type DataFunctionArgs,
  type V2_MetaFunction,
} from "@remix-run/node";
import { useLoaderData, useSearchParams } from "@remix-run/react";
import { LayersIcon } from "lucide-react";
import { GeneralErrorBoundary } from "~/components/error-boundary";
import { authenticator } from "~/services/auth.server";
import { commitSession, getSession } from "~/services/session.server";
import { InlineLogin } from "../resources+/login";

export async function loader({ request }: DataFunctionArgs) {
  await authenticator.isAuthenticated(request, {
    successRedirect: "/",
  });
  const session = await getSession(request.headers.get("cookie"));
  const error = session.get(authenticator.sessionErrorKey);
  let errorMessage: string | null = null;
  if (typeof error?.message === "string") {
    errorMessage = error.message;
  }
  return json(
    { formError: errorMessage },
    {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    }
  );
}

export const meta: V2_MetaFunction = () => {
  return [{ title: "Login to Forge CMS" }];
};

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const data = useLoaderData<typeof loader>();

  const redirectTo = searchParams.get("redirectTo") || "/admin";

  return (
    <div className="flex min-h-screen flex-col justify-center pb-32 pt-20 overflow-hidden">
      <div className="mx-auto w-full max-w-md">
        <div className="text-center">
          <h1 className="text-4xl text-white mb-2 inline-flex">
            <LayersIcon className="w-8 h-8 m-auto mb-4 mr-4 text-emerald-400" />
            ForgeCMS
          </h1>
        </div>
        <InlineLogin redirectTo={redirectTo} formError={data.formError} />
      </div>
    </div>
  );
}

export function ErrorBoundary() {
  return <GeneralErrorBoundary />;
}
