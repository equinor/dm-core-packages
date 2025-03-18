# Markdown Example

## Headings 

# h1 Heading
## h2 Heading
### h3 Heading
#### h4 Heading
##### h5 Heading
###### h6 Heading

## Text Emphasis 

**This is bold text**

__This is also bold text__

*This is italic text*

_This is also italic text_

~~Strikethrough~~


## Blockquotes 


> Blockquotes can also be nested...
>> ...by using additional greater-than signs right next to each other...
> > > ...or with spaces between arrows.


## Lists 

### Unordered

+ Create a list by starting a line with `+`, `-`, or `*`
+ Sub-lists are made by indenting 2 spaces:
  - Lists can also be nested
    - Ac tristique libero volutpat at
    - Facilisis in pretium nisl aliquet
    - Nulla volutpat aliquam velit

### Ordered

1. The first item in a ordered list
2. The second item in a ordered list
3. The third item in a ordered list
    1. Ordered lists can also be nested
    1. Starting marker can stay the same

You can also start list numbering with offset:

57. foo
1. bar


## Code 

### Inline code

This sentence has `inline-code`


### Block code

```
Sample text here...
```

### Code with syntax highlighting


#### Javascript example
``` js
var foo = function (bar) {
  return bar++;
};

console.log(foo(5));
```

#### JSON example
``` json
{
    "attribute": "value",
    "array": [
        "string", "string2", true, 1039
    ]
}
```


## Tables 

### Default table

| App Name   | App Version | Domain Name     |
| ---------- | ------------| --------------- |
| Bigtax     | 9.5         | telegraph.co.uk |
| Fix San    | 1.25        | deviantart.com  |
| Trippledex | 0.50        | seesaa.net      |
| Flexidy    | 5.23        | people.com.cn   |


### Table with right aligned columns

| App Name   | App Version | Domain Name     |
| ---------: | -----------:| --------------: |
| Bigtax     | 9.5         | telegraph.co.uk |
| Fix San    | 1.25        | deviantart.com  |
| Trippledex | 0.50        | seesaa.net      |
| Flexidy    | 5.23        | people.com.cn   |


## Links

- [This is a link](http://dev.nodeca.com)

- [Hover me to see title](http://nodeca.github.io/pica/demo/ "This is the title text!")

- Autoconverted link https://github.com/nodeca/pica 


## Images 

![Minion](https://octodex.github.com/images/minion.png)
![Stormtroopocat](https://octodex.github.com/images/stormtroopocat.jpg "The Stormtroopocat")


## Referencing Footnotes

Footnote 1 link[^first].

Footnote 2 link[^second].

Inline footnote^[Text of inline footnote] definition.

Footnotes can be references twice reference[^second].

[^first]: Footnote **can have markup**

    and multiple paragraphs.

[^second]: Footnote text.


## Tasklist

* [ ] to do
* [x] done
    * [x] task lists can also be nested