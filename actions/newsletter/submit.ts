export const runtime = "server"
import { AppContext } from "apps/vtex/mod.ts";
import type { CreateNewDocument } from "apps/vtex/utils/types.ts";

export interface Props {
  data: {
    nome: string;
    email: string;
    whats?: string;
    aceite: boolean;
  },
  acronym: string;
}

const action = async (
  props: Props,
  _req: Request,
  ctx: AppContext,
): Promise<CreateNewDocument | undefined> => {
  // deno-lint-ignore no-explicit-any
  const { vcs }: any = await ctx.invoke.vtex.loaders.config();
  const { data, acronym } = props;

  const requestOptions = {
    body: data,
    headers: {
      "accept": "application/json",
      "content-type": "application/json",
    },
  };

  const response = await (
    vcs[`POST /api/dataentities/${acronym}/documents`]({}, requestOptions)
  );

  return response.json();
};

export default action;