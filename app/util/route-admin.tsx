
class Routes {
  base = "/admin/home";

  toRoute(opts: {
    main: string;
    routePrefix?: string[];
    routeSufix?: string[];
    q?: Record<string, string | undefined>;
  }): string {
    let url = `${this.base}/`;
    if (opts.routePrefix) {
      url += opts.routePrefix.join("/") + "/";
    }
    url += opts.main;
    if (opts.routeSufix) {
      url += "/" + opts.routeSufix.join("/");
    }
    return this.baseRoute(url, opts.q);
  }

  baseRoute(
    url: string,
    q?: {
      [x: string]: string | undefined;
    }
  ): string {
    if (q) {
      url += "?";
      const queryParams = Object.entries(q)
        .filter(([_, value]) => value !== undefined) // Filter out undefined values
        .map(
          ([key, value]) =>
            `${encodeURIComponent(key)}=${encodeURIComponent(value || "")}`
        ) // Encode each key-value pair
        .join("&"); // Join them with '&'

      if (queryParams) {
        url += queryParams;
      }
    }
    return url;
  }
}
export const routes = new Routes();
