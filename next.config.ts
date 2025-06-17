// scss utils are automatically imported into each scss file (see /src/scss/utils/index.scss)

import path from "path";
import type { NextConfig } from "next";
import type { Configuration, RuleSetRule } from "webpack";

const nextConfig: NextConfig = {
  webpack(config: Configuration) {
    const rules = config.module?.rules || [];

    for (const rule of rules) {
      if (rule && typeof rule === "object" && "oneOf" in rule && Array.isArray(rule.oneOf)) {
        for (const oneOfRule of rule.oneOf as RuleSetRule[]) {
          if (Array.isArray(oneOfRule.use)) {
            for (const loader of oneOfRule.use) {
              if (
                loader &&
                typeof loader === "object" &&
                loader.loader?.includes("sass-loader") &&
                loader.options &&
                typeof loader.options === "object"
              ) {
                loader.options.additionalData = `@use "@/scss/utils/index.scss" as *;`;
                loader.options.sassOptions = {
                  ...(loader.options.sassOptions || {}),
                  includePaths: [path.resolve(__dirname, "src")]
                };
              }
            }
          }
        }
      }
    }

    return config;
  }
};

export default nextConfig;
