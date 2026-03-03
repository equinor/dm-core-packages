# Page snapshot

```yaml
- generic [ref=e2]:
  - region "Notifications Alt+T"
  - generic [ref=e5]:
    - tablist [ref=e7]:
      - tab "self" [ref=e8]:
        - button "self" [ref=e9] [cursor=pointer]:
          - generic [ref=e10]: self
      - tab "assistant Close assistant" [selected] [ref=e11]:
        - button "assistant" [ref=e12] [cursor=pointer]:
          - generic [ref=e13]: assistant
        - button "Close assistant" [ref=e14] [cursor=pointer]:
          - img [ref=e16]
    - tabpanel [ref=e19]:
      - generic [ref=e24]:
        - code [ref=e27]: "type: dmss://DemoDataSource/plugins/form/uncontained_object/blueprints/Person name: John phoneNumber: 1234"
        - generic [ref=e28]:
          - button "0" [ref=e29] [cursor=pointer]:
            - img [ref=e30]
            - generic [ref=e32]: "0"
          - button [ref=e33] [cursor=pointer]:
            - img [ref=e34]
          - button "JSON" [ref=e36] [cursor=pointer]
          - button "Copy as YAML" [ref=e37] [cursor=pointer]:
            - img [ref=e38]
```