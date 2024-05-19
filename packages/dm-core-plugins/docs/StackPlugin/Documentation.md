`StackPlugin` allows you to stack views next to each other horizontally or vertically. 

## Table of contents
- [Passing views](#passing-views)
- [Placement config](#placement-config)

### Passing views \{#passing-views}
Simply pass viewConfigs in the order you want to showcase to the `items` config field.

```json title="view-items.recipe.json"
items: [
    {
        "type": "CORE:ViewConfig",
        "scope": "movies"
    },
    {
        "type": "CORE:ViewConfig",
        "scope": "shows"
    },
    {
        "type": "CORE:ViewConfig",
        "scope": "music",
    }
]
```

### Placement config \{#placement-config}
In the plugins [config blueprint](./Blueprints) you can see all the ways you can place and space views.