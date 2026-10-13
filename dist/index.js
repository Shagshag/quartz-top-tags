import { jsx, jsxs } from "preact/jsx-runtime"

/** Relative URL from `current` slug to `target`, like Quartz's resolveRelative. */
const relativeTo = (current, target) => {
  const depth = current.split("/").length - 1
  const root = depth === 0 ? "." : Array(depth).fill("..").join("/")
  return target ? `${root}/${target}` : root
}

const css = `.top-tags {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.top-tags h3 {
  margin: 0;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--gray);
}
.top-tags ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}
.top-tags li a.tag-chip {
  display: inline-block;
  padding: 0.1rem 0.55rem;
  border: 1px solid var(--lightgray);
  border-radius: 1rem;
  font-size: 0.85rem;
  color: var(--darkgray);
  background-color: transparent;
}
.top-tags li a:hover {
  color: var(--secondary);
  border-color: var(--secondary);
}
.top-tags li a span {
  color: var(--gray);
  margin-left: 0.25rem;
}
.top-tags .all-tags {
  font-size: 0.85rem;
}`

/** The `limit` most-used tags (with article counts) and a link to the full tag list. */
export const TopTags = (opts) => {
  const options = { limit: 8, title: "Tags", ...opts }

  const Component = ({ fileData, allFiles, displayClass }) => {
    const counts = new Map()
    for (const file of allFiles) {
      for (const tag of new Set(file.frontmatter?.tags ?? [])) {
        counts.set(tag, (counts.get(tag) ?? 0) + 1)
      }
    }
    const top = [...counts.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .slice(0, options.limit)
    if (top.length === 0) return null

    const slug = fileData.slug
    return jsxs("div", {
      class: [displayClass, "top-tags"].filter(Boolean).join(" "),
      children: [
        jsx("h3", { children: options.title }),
        jsx("ul", {
          children: top.map(([tag, count]) =>
            jsx("li", {
              children: jsxs("a", {
                href: relativeTo(slug, `tags/${tag}`),
                class: "tag-chip",
                children: [tag, jsx("span", { children: count })],
              }),
            }),
          ),
        }),
        jsx("a", {
          href: relativeTo(slug, "tags/"),
          class: "all-tags",
          children: "Tous les tags →",
        }),
      ],
    })
  }

  Component.css = css
  return Component
}

export default TopTags
