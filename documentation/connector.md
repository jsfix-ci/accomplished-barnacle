# Connector workflow
Depending on which components your connector provides, those components will be used to througout the following workflow

1. Configuration validation and parsing (required: configuration object). The configuration object is invoked to validate the content of the configuration file and to parse the content.
2. Topic selection. The connector has to select the topic, which contains the domain model. Any changes subsequently detected are stored in this topic.
3. Reconciliation. In turn, for each part of the domain model, differences between the domain model and the connected project software are detected. Any differences are resolved by creating suitable object events, which are applied to the domain model and stored in the backend. The order in which parts of the domain model are checked is:
    1. State model (required: state model object)
    