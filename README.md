#  Counter Wasm Dapp


# Clone project
1. Clone the repo 
    ```
    git clone https://github.com/5ire-tech/counter-wasm-dapp
2. Go inside the folder
    ``` 
    cd counter-wasm-dapp
    ```
# Prerequisites

- Node >= 16.0 ([https://nodejs.org](https://nodejs.org))
- yarn
- Install Rust and Cargo: https://doc.rust-lang.org/cargo/getting-started/installation.html
- Install Wasm: `rustup target add wasm32-unknown-unknown --toolchain nightly`

- Install Ink CLI:`cargo install cargo-contract --force`



# Ink! Smart Contract
+ Go to `contracts` folder:
    ```
    cd contracts
    ```
. We use `ink!` language to write smart contract [ink!](https://paritytech.github.io/ink/). 
+ Write your [counter](https://github.com/5ire-tech/counter-wasm-dapp/tree/master/contracts/counter) smart contract

    >Inititalize value 
    `constructor new(init_value:i32)` 

    >Increase value by sign transaction
    `function inc()`

    >Decrease value by sign transaction
    `function dec()`

    >Query/ Get value 
    `function get()`
+ Build wasm smart contract

    ```
    ./scripts/build.sh
    ```
+ Deploy counter smart contract
    - `cd contracts/scripts/deploy`
    - In this project, copy the `.env.test` file to a file named `.env`, and then edit it to fill in the details. Enter your mnemonics phrase which will send the deployment transaction.
    - `yarn install`
    - Deploy smart contract:
        ```
        node deploy.js
        ```
        `Contract Address: 5FKt5cgVbvi9PPNL18dSsnuCCFdC5X1UmLwLcY7tFLUKtL3P`
# Frontend

+ Go to `ui` folder: 
    ```
    cd ui
    ```
+ Install dependencies
    ```
    yarn install
    ```
+ Put contract address that your smart contract is deployed in `.env` file
    ```
    REACT_APP_CONTRACT_ADDRESS=xxx
    ```

+ Start frontend
    ```
    yarn start
    ```

