Form allows user to input and save data.

## Table of contents
- [Selecting form fields](#fields)
- [Using widgets](#using-widgets)
- [Configuring recipe for nested objects](#object-recipes)
- [Available Widgets](#available-widgets)


### Selecting form fields \{#fields}
Pass field names defined in blueprint to fields array.
```json {3}
"config": {
      "type": "PLUGINS:dm-core-plugins/form/FormInput",
      "fields": ["name", "date_of_birth", "address"]
}
```

### Using widgets \{#using-widgets}
```json {7}
"config": {
    "type": "PLUGINS:dm-core-plugins/form/FormInput",
    "attributes": [
        {
            "name": "date_of_birth",
            "type": "PLUGINS:dm-core-plugins/form/fields/StringField",
            "widget": "DateTimeWidget"
        }
    ],
    "fields": ["name", "date_of_birth", "address"]
}
```

### Configuring recipe for nested objects \{#object-recipes}
```json {8}
"config": {
    "type": "PLUGINS:dm-core-plugins/form/FormInput",
    "attributes": [
    {
        "name": "address",
        "type": "PLUGINS:dm-core-plugins/form/fields/ObjectField",
        "showInline": true,
        "uiRecipe": "Edit"
    }
    ],
    "fields": ["name", "date_of_birth", "address"]
}
```


### Available Widgets \{#available-widgets}
`CheckboxWidget`: [Blueprint](./Blueprints.md#CheckboxWidget)

`TextWidget`: [Blueprint](./Blueprints.md#TextWidget)

`TextareaWidget`: [Blueprint](./Blueprints.md#TextareaWidget)

`BlueprintPickerWidget`: [Blueprint](./Blueprints.md#BlueprintPickerWidget)

`TypeWidget`: [Blueprint](./Blueprints.md#TypeWidget)

`SwitchWidget`: [Blueprint](./Blueprints.md#SwitchWidget)

`SelectWidget`: [Blueprint](./Blueprints.md#SelectWidget)

`NumberWidget`: [Blueprint](./Blueprints.md#NumberWidget)

`DateTimeWidget`: [Blueprint](./Blueprints.md#DateTimeWidget)

`DimensionalScalarWidget`: [Blueprint](./Blueprints.md#DimensionalScalarWidget)

`EntityPickerWidget`: [Blueprint](./Blueprints.md#EntityPickerWidget)

`HyperlinkWidget`: [Blueprint](./Blueprints.md#HyperlinkWidget)