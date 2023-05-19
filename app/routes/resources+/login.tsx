import { useForm } from "@conform-to/react";
import { getFieldsetConstraint, parse } from "@conform-to/zod";
import { DataFunctionArgs, json, redirect } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import { AuthorizationError } from "remix-auth";
import { FormStrategy } from "remix-auth-form";

import { z } from "zod";
import { ErrorList, Field } from "~/components/form";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { authenticator } from "~/services/auth.server";
import { commitSession, getSession } from "~/services/session.server";
import { safeRedirect } from "~/utils/misc";
import {
  passwordSchema,
  usernameSchema,
} from "~/utils/validators/user-validation";
import { checkboxSchema } from "~/utils/validators/zod-extensions";

export const LoginFormSchema = z.object({
  username: usernameSchema,
  password: passwordSchema,
  redirectTo: z.string().optional(),
  remember: checkboxSchema(),
});

export const action = async ({ request }: DataFunctionArgs) => {
  const formData = await request.clone().formData();

  const submission = parse(formData, {
    schema: LoginFormSchema,
    acceptMultipleErrors: () => true,
  });

  if (!submission.value || submission.intent !== "submit") {
    return json(
      {
        status: "error",
        submission,
      } as const,
      { status: 400 }
    );
  }

  let userId: string | null = null;
  try {
    userId = await authenticator.authenticate(FormStrategy.name, request, {
      throwOnError: true,
    });
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return json(
        {
          status: "error",
          submission: {
            ...submission,
            error: {
              // show authorization error as a form level error message.
              "": error.message,
            },
          },
        } as const,
        { status: 400 }
      );
    }
    throw error;
  }

  const session = await getSession(request.headers.get("cookie"));
  session.set(authenticator.sessionKey, userId);
  const { remember, redirectTo } = submission.value;
  const newCookie = await commitSession(session, {
    maxAge: remember
      ? 60 * 60 * 24 * 7 // 7 days
      : undefined,
  });

  if (redirectTo) {
    throw redirect(safeRedirect(redirectTo), {
      headers: { "Set-Cookie": newCookie },
    });
  }
  return json({ status: "success", submission } as const, {
    headers: { "Set-Cookie": newCookie },
  });
};

export function InlineLogin({
  redirectTo,
  formError,
}: {
  redirectTo?: string;
  formError?: string | null;
}) {
  const loginFetcher = useFetcher<typeof action>();

  const [form, fields] = useForm({
    id: "inline-login",
    constraint: getFieldsetConstraint(LoginFormSchema),
    lastSubmission: loginFetcher.data?.submission,
    onValidate({ formData }) {
      return parse(formData, { schema: LoginFormSchema });
    },
    shouldRevalidate: "onBlur",
  });

  return (
    <div>
      <loginFetcher.Form
        method="POST"
        action="/resources/login"
        name="login"
        {...form.props}
      >
        <Field
          id="username"
          label="Username"
          errors={fields.username.errors}
          required={fields.username.required}
        />
        <Field
          id="password"
          label="Password"
          errors={fields.password.errors}
          required={fields.password.required}
          type="password"
        />
        <div className="flex items-center space-x-2">
          <Checkbox id="terms" {...fields.remember} />
          <label
            htmlFor="terms"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Remember me
          </label>
        </div>
        <input value={redirectTo} {...fields.redirectTo} type="hidden" />
        <ErrorList errors={formError ? [formError] : []} />
        <ErrorList errors={form.errors} id={form.errorId} />
        <Button
          type="submit"
          disabled={loginFetcher.state !== "idle"}
          className="mt-4 md:mt-8 w-full"
        >
          Log in
        </Button>
      </loginFetcher.Form>
    </div>
  );
}
