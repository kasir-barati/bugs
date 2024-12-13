```graphql
query FindAllAlerts {
  findAllAlerts {
    id
    alertType {
      id
    }
  }
}
```

```graphql
mutation CreateAlertType() {
    createAlertType(createAlertTypeInput: {
    "createAlertTypeInput": {
      "description": "ppp",
      "name": "ooo"
    }
  }) {
    id
  }
}
```

```graphql
mutation() {
    createAlert(createAlertInput: {
    "createAlertInput": {
      "alertTypeId": "9cbf441c-a024-42c9-b8e5-7396a8982fd5",
      "description": "ssss",
      "title": "rrrr"
    }
  }) {
    id
  }
}
```

```graphql
query FindAllAlertType {
  findAllAlertTypes {
    id
    alerts {
      id
      title
    }
  }
}
```
