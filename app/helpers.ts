import { zfd } from "zod-form-data";

const intentSchema = zfd.formData({
  intent: zfd.text(),
});

export function hasIntent(formData: FormData, intent: string) {
  const { intent: formIntent } = intentSchema.parse(formData);
  return formIntent === intent;
}
