import { getMDXComponent } from "mdx-bundler/client";
import { useMemo } from "react";
import { json, Link, LoaderFunction, useLoaderData } from "remix";
import { getPost } from "~/utils/post";

type LoaderData = {
  frontmatter: any;
  code: string;
};

export const loader: LoaderFunction = async ({ params, request }) => {
  const slug = params["*"];
  if (!slug) throw new Response("Not found", { status: 404 });

  const post = await getPost(slug);
  if (post) {
    const { frontmatter, code } = post;
    return json({ frontmatter, code });
  }
};

export default function Post() {
  const { code, frontmatter } = useLoaderData<LoaderData>();
  const Component = useMemo(() => getMDXComponent(code), [code]);

  return (
    <>
      <Link to="/">← Back to blog index</Link>
      {frontmatter.image && (
        <div className="mb-6 -mt-6">
          <div className="text-center">
            <div>
              <img
                src={frontmatter.image.url}
                className="object-cover object-center w-full"
              />
            </div>
            <p className="mt-2 text-sm text-slate-600">
              Credit:{" "}
              <a href={frontmatter.image.credit.url}>
                {frontmatter.image.credit.text}
              </a>
            </p>
          </div>
        </div>
      )}

      <h1 className="my-20">{frontmatter.title}</h1>

      <Component attributes={frontmatter} />
      {/* <div className="hero">Sign up to get notified about new posts.</div> */}
    </>
  );
}
