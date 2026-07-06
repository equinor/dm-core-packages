/**
 * Configuration for the Site directory plugin.
 *
 * Every field is optional so the plugin works with an empty config: it then
 * lists sites across the app's visible data sources and (if one is available)
 * lets users create a new site in the first of them.
 */
export type TSiteDirectoryConfig = {
  /** Heading shown above the gallery. Defaults to "Websites". */
  heading?: string
  /**
   * The entity `type` to list. Defaults to the builder's Site type
   * (`PLUGINS:dm-core-plugins/builder/Site`). Override to list a different
   * blueprint (e.g. a project-specific site type that extends it).
   */
  entityType?: string
  /**
   * Data sources to search. Defaults to the application's visible data sources.
   */
  dataSources?: string[]
  /**
   * Where "New site" creates the entity — a DMSS address (usually a data source
   * root, e.g. `Sites`). Defaults to the first searched data source. When no
   * target can be determined, the create button is hidden.
   */
  targetDataSource?: string
  /**
   * URL opened when a site card (or a freshly created site) is visited. `{id}`
   * and `{dataSource}` are substituted. Defaults to
   * `/view?documentId=dmss://{dataSource}/{id}` — the convention used by the
   * example app's viewer route.
   */
  viewUrlTemplate?: string
  /** Name given to a site created via "New site". Defaults to "New site". */
  newSiteName?: string
  /** Set false to hide the "New site" button (a read-only gallery). */
  allowCreate?: boolean
}
