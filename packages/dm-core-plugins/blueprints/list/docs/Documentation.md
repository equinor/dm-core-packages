Lists display information where objects listed are structured the same. In dm applications it's also a great way for user to navigate nested items and objects.

## Table of contents
- [Passing data](#passing-data)
    - [Scope to list](#scope)
    - [Headers](#headers)

## Passing data \{#passing-data}

### Scope to list \{#scope}
List expects an array of objects. Array is passed to the plugin by using the scope method in ViewConfig.
```json {4}
"viewConfig": {
    "type": "CORE:ViewConfig",
    "recipe": {…},
    "scope": "array_attribute_name"
}
```

### Headers \{#headers}
Select data fields by passing attribute name in `headers` config.
```json {3}
"config": {
    "type": "PLUGINS:dm-core-plugins/table/ListPluginConfig",
    "headers": ["first_name", "last_name", "age"]
}
```