# Tweetverse | [![Build Status](https://dev.azure.com/sicotin/sicotin/_apis/build/status/simonaco.tweetverse?branchName=master)](https://dev.azure.com/sicotin/sicotin/_build/latest?definitionId=20&branchName=master&WT.mc_id=tweetverse-github-sicotin)

## Deploy resources

[![Deploy to Azure](https://azuredeploy.net/deploybutton.png)](https://portal.azure.com/?WT.mc_id=tweetverse-github-sicotin#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Fsimonaco%2Ftweetverse%2Fmaster%2Fazuredeploy.json)

## Prerequisites

1. A recent version of Node (8+)

1. VS Code: [here](https://code.visualstudio.com/download/?WT.mc_id=tweetverse-github-sicotin)

1. Azure Functions CLI: [here](https://docs.microsoft.com/en-us/azure/azure-functions/functions-run-local?WT.mc_id=tweetverse-github-sicotin)  

1. Azure Functions Extension for VS Code: [here](https://marketplace.visualstudio.com/items/?WT.mc_id=tweetverse-github-sicotin&itemName=ms-azuretools.vscode-azurefunctions)  

1. Azure account: [here](https://azure.microsoft.com/en-us/free/?wt.mc_id=tweetverse-github-sicotin)

## How to run this

1. Clone this repository and cd into *tweetverse*

1. Create *local.settings.json* file and add:

```json
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "",
    "FUNCTIONS_WORKER_RUNTIME": "node",
    "BEARER_TOKEN":"YOUR-TWITTER-TOKEN-HERE",
    "TEXT_ANALYTICS_API_KEY":"YOUR-API_KEY-HERE",
    "SLACK_API_URL":"YOUR-URL-HERE",
  }
}
```

1. Run ```npm i``` and ```npm start```


🙋🏼 Happy coding! 🙋🏼