Use sidebar as primary site and entity navigation.

### Passing views
Simply pass viewConfig as ViewSelectorItems through `items` attribute.

```json
"items": [
  {
    "type": "PLUGINS:dm-core-plugins/view_selector/ViewSelectorItem",
    "label": "SidebarItem 1",
    "viewConfig": {}
  }
]
```

### Using icons
ViewSelectorItems can also include [eds icons](https://storybook.eds.equinor.com/?path=/docs/icons-iconpreview-docs--docs) before label. Simply pass the name of the icon in the eds_icon field.

```json {5}
"items": [
  {
    "type": "PLUGINS:dm-core-plugins/view_selector/ViewSelectorItem",
    "label": "SidebarItem 1",
    "eds_icon": "home",
    "viewConfig": {}
  }
]
```

### subItems / nested views
Every ViewSelectorItem can also receive subItems which allows you to pass viewConfigs and nest views.
```json {5}
"items": [
  {
    "type": "PLUGINS:dm-core-plugins/view_selector/ViewSelectorItem",
    "label": "SidebarItem 1",
    "subItems": [
      {
        "type": "PLUGINS:dm-core-plugins/view_selector/ViewSelectorItem",
        "label": "Sub Item 1",
        "viewConfig": {}
      }
    ],
    "viewConfig": {}
  }
]
```