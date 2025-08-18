import * as prismic from "@prismicio/client";

const repoName = process.env.PRISMIC_REPO_NAME;
const accessToken = process.env.PRISMIC_ACCESS_TOKEN;

if (!repoName || !accessToken) {
  throw new Error("PRISMIC_REPO_NAME or PRISMIC_ACCESS_TOKEN is not defined");
}

export const client = prismic.createClient(repoName, { accessToken });