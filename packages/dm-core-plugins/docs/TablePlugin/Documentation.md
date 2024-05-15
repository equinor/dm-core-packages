Tables display information in a way that's easy to scan, so that users can look for patterns and insights. They allow you to showcase a variety amounts of structured data and for use in dm applications, a great way for user to navigate nested items and objects.

## Table of contents
- [Table variants](#variants)
- [Passing data](#passing-data)
    - [Scope to list](#scope)
    - [Selecting data](#selecting-data)
    - [Column config](#column-config)
- [Functionality](#functionality)
    - [Enabling/disabling functionality](#limiting-editing)
    - [Sorting](#sorting)

## Variants \{#variants}
Table config expects a list of table variants. Available variants are `view` and `edit`. You can pass one or both variants in the list - if both variants are enabled/passed, user can switch modes in the UI. The initial table variant that shows in the UI is based on which variant is passed first in the variant list.

```json title="table-variant.recipe.json
"variant": [
    {
        "name": "view",
        "type": "PLUGINS:dm-core-plugins/table/TableVariantConfig",
        "functionality": {
            "add": false,
            "delete": false
        },
        "density": "comfortable",
    },
    {
        "name": "edit",
        "type": "PLUGINS:dm-core-plugins/table/TableVariantConfig",
    }
]
```

## Passing data \{#passing-data}

### Scope to list \{#scope}
Table expects a list of objects. List is passed to the plugin by using the scope method in ViewConfig.
```json {4}
"viewConfig": {
    "type": "CORE:ReferenceViewConfig",
    "recipe": {…},
    "scope": "list_attribute_name"
}
```

### Selecting data \{#selecting-data}

Select fields from objects in list passed to table by defining columns and passing field name in the `data` field.

```json {7}
"recipe": {
    "config": {
        "type": "PLUGINS:dm-core-plugins/table/TablePluginConfig",
        "columns": [
            {
                "type": "./TableColumnConfig",
                "data": "name",
                "label": "Name"
            }
        ]
    }
}
```

You can also select data by using dot syntax to show and edit nested data in objects.

```json {7,12}
"recipe": {
    "config": {
        "type": "PLUGINS:dm-core-plugins/table/TablePluginConfig",
        "columns": [
            {
                "type": "./TableColumnConfig",
                "data": "person.firstName",
                "label": "First Name"
            },
            {
                "type": "./TableColumnConfig",
                "data": "hobbies[0].name",
                "label": "Favorite hobby"
            }
        ]
    }
}
```

### Column config \{#column-config}

#### dataType
`dataType` is used to format fields when you're editing and saving data. Available types are `'string' | 'boolean' | 'number' | 'datetime'`. The type should match the attribute type in blueprint.

#### presentAs
When dataType is boolean, by default the field is shown as a checkbox in the table. Value can also be shown as plain text by setting `presentAs` to `text`.

#### labels
Set column header label.

#### editable
Even if you're table is editable, it's possible to disable editing for individual columns by setting `editable` to `false`.

#### sortable
Sortable columns can be enabled by setting `sortable` to `true`. Sorting is only available in view/no-edit variant of table.

### Entry points to new tab and expandable content
There are two predefined fieldNames that allows you to add functionality to make the row expandable and open the table item in a new tab. These are prefixed by `^`. 

#### Open in new tab
Opens item in new tab. Should be used in accordance with TabsPlugin/a view selector.
```json {7}
"recipe": {
    "config": {
        "type": "PLUGINS:dm-core-plugins/table/TablePluginConfig",
        "columns": [
            {
                "type": "./TableColumnConfig",
                "data": "^tab",
            }
        ]
    }
}
```

#### Expandable
```json {7}
"recipe": {
    "config": {
        "type": "PLUGINS:dm-core-plugins/table/TablePluginConfig",
        "columns": [
            {
                "type": "./TableColumnConfig",
                "data": "^expandable",
            }
        ]
    }
}
```
When using expandable for table items you can also pass a custom viewConfig for only this view by using the `expandableViewConfig` config field.