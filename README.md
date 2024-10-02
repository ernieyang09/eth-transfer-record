# Token Transfer Record

- [x] Connect wallets (e.g., MetaMask).
- [x] Display the user’s ETH balance on Scroll Layer2.
- [x] Implement a simple transfer form that allows users to send ETH to a recipient’s address.
- [x] Use a mock API to record the transfer history and display it on the front-end.

### Tech stack

- next.js
- shadcn UI
- tailwind
- wagmi (I don't use ethers or web3)

- drizzle
- postgresql

### Enchancement

- Add USDT tab.
- Add sign, and have auth api  
  Right now, anyone and simply post new record to any address. Need sign action and give auth(like jwt) to make sure you have rights to create and change the record.
- Error handling
- Better UX like, refetch transaction.
- Have cron job to scan pending tx.
