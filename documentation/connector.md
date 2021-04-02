# Connector workflow
Depending on which components your connector provides, those components will be used to througout the following workflow

1. Configuration validation and parsing (required: configuration object). The configuration object is invoked to validate the content of the configuration file and to parse the content.

2. Topic selection. The connector has to select the topic, which contains the domain model. Any changes subsequently detected are stored in this topic.