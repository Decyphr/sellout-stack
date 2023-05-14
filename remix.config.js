/** @type {import('@remix-run/dev').AppConfig} */
const { flatRoutes } = require('remix-flat-routes')

module.exports = {
  // appDirectory: "app",
  // assetsBuildDirectory: "public/build",
  // serverBuildPath: "build/index.js",
  // publicPath: "/build/",
  future: {
    v2_errorBoundary: true,
    v2_meta: true,
    v2_normalizeFormMethod: true,
    v2_routeConvention: true,
    unstable_dev: true
  },
  serverModuleFormat: "cjs",
  tailwind: true,
  ignoredRouteFiles: ["**/.*"],
  routes: async defineRoutes => {
    return flatRoutes('routes', defineRoutes)
  },
};
