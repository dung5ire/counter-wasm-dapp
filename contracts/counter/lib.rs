#![cfg_attr(not(feature = "std"), no_std)]

use ink_lang as ink;

#[ink::contract]
mod incrementer {
    #[ink(storage)]
    pub struct Counter {
        value: i32,
    }

    impl Counter {
        #[ink(constructor)]
        pub fn new(init_value: i32) -> Self {
            Self { value: init_value }
        }

        #[ink(constructor)]
        pub fn new_default() -> Self {
            Self::new(Default::default())
        }

        #[ink(message)]
        pub fn inc(&mut self) {
            self.value += 1;
        }

        #[ink(message)]
        pub fn des(&mut self) {
            self.value -= 1;
        }

        #[ink(message)]
        pub fn get(&self) -> i32 {
            self.value
        }
    }

    #[cfg(test)]
    mod tests {
        use super::*;
        use ink_lang as ink;
        #[ink::test]
        fn default_works() {
            let contract = Counter::new_default();
            assert_eq!(contract.get(), 0);
        }

        #[ink::test]
        fn it_works() {
            let mut contract = Counter::new(42);
            assert_eq!(contract.get(), 42);
            contract.inc();
            assert_eq!(contract.get(), 43);
            contract.des();
            assert_eq!(contract.get(), 42);
        }
    }
}