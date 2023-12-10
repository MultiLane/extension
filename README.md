## Multilane Extension
This repo is responsoble for modifying the 1. Fetch calls and 2. Make transactions.

#### 1. Fetch calls
Calls like get balance are intercepted by this extension and redirects this call to multinode nodes

#### 2. Make transaction
Here EOA transactions are converted into SCW transaction

### Installation
```
git clone https://github.com/MultiLane/extension
cd extension
```

### Build
```
npm run build
```

### Installing on chrome
+ Go to chrome://extensions/
+ Turn on developer mode if it's off.
+ Click on load unpacked and select the directory
