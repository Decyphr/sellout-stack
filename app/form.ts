import { createForm } from "remix-forms";
// For Remix, import it like this
import {
  Form as FrameworkForm,
  useActionData,
  useNavigation,
  useSubmit,
} from "@remix-run/react";

const Form = createForm({
  component: FrameworkForm,
  useNavigation,
  useSubmit,
  useActionData,
});

export { Form };
