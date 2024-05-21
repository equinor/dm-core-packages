Plugin based on [react-grid-system](https://www.npmjs.com/package/react-grid-system) npm package which is a Bootstrap-like responsive grid system.

### Passing views

ResponsiveGridPlugin config takes a list of rows.

```json {3}
 "config": {
    "type": "PLUGINS:dm-core-plugins/responsive_grid/ResponsiveGridPluginConfig",
    "rows": []
 }
```

A list of rows expects a column attribute which contains a list of `ColumnItems`. A ColumnItem expects a viewConfig and also allows you set what kind of width the column item should have based on various breakpoints.

```json {6}
 "config": {
    "type": "PLUGINS:dm-core-plugins/responsive_grid/ResponsiveGridPluginConfig",
    "rows": [
        {
            "type": "PLUGINS:dm-core-plugins/responsive_grid/RowItem",
            "columns": [
                {
                    "type": "PLUGINS:dm-core-plugins/responsive_grid/ColumnItem",
                    "viewConfig": {},
                    "size": {
                        "type": "PLUGINS:dm-core-plugins/responsive_grid/ColumnSize",
                        "sm": 12,
                        "md": 4
                    }
                },
                {
                    "type": "PLUGINS:dm-core-plugins/responsive_grid/ColumnItem",
                    "viewConfig": {},
                    "size": {
                        "type": "PLUGINS:dm-core-plugins/responsive_grid/ColumnSize",
                        "sm": 12,
                        "md": 4
                    }
                }
            ]
        },
    ]
 }
```

### Sizing and breakpoints

#### Breakpoints
CSS breakpoints allow you to style the website and specify layout according to the device width it's being viewed on. This plugin uses react-grid-system default breakpoints.

| **size** | **pixels** |
| -------- | ---------- |
|    xs    |    576     |
|    sm    |    768     |
|    md    |    992     |
|    lg    |    1200    |
|    xl    |    1600    |
|    xxl   |    1920    |

#### Sizing
A grid is based on 12 grid columns, meaning that you can split these 12 columns/section on the column items you have passed in the row. A full width item would have to span all 12 columns so we would pass a 12 to a breakpoint. 
```json {3}
"size": {
    "type": "PLUGINS:dm-core-plugins/responsive_grid/ColumnSize",
    "xs": 12,
}
```

#### Sizing based on breakpoints
When sizing for a breakpoint we define the value it's supposed to be for the width the breakpoint it represents and anything wider UNLESS a bigger breakpoint has been defined with another value.

In this example: on small devices the configured item would span 12 grid columns on devices smaller than 992px in width and span 4 grid columns on bigger than 992px in width.
```json {3-4}
"size": {
    "type": "PLUGINS:dm-core-plugins/responsive_grid/ColumnSize",
    "xs": 12,
    "md": 4,
}
```