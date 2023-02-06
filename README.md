#  Counter Wasm Dapp


# Clone project
1. Clone the repo 
    ```
    git clone https://github.com/5ire-tech/counter-wasm-dapp
2. Go inside the folder
    ``` 
    cd counter-wasm-dapp
    ```
# Ink! Smart Contract
+ Go to `contracts` folder:
    ```
    cd contracts
    ```
. We use `ink!` language to write smart contract [ink!](https://paritytech.github.io/ink/). 
+ Write your [counter](https://github.com/5ire-tech/wasm-contract-example/tree/develop/incrementer) smart contract

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

# Frontend

+ Go to `ui` folder: 
    ```
    cd ui
    ```
+ Install dependencies
    ```
    yarn install
    ```

+ Start frontend
    ```
    yarn start
    ```

