import fetch from 'node-fetch'

export interface LOCKBalance {
  balance: number
  asset: string
  blockchain: string
  stakingStrategy: string
}

export class LOCKClient {
  static baseUrl = 'https://api.lock.space/'
  static balance = 'v1/staking/balance'

  static getUserBalance(address: string): Promise<LOCKBalance[]> {
    console.log('fetching lock balance for', address)
    return fetch(`${LOCKClient.baseUrl}${LOCKClient.balance}?userAddress=${address}`, { method: 'GET' }).then(
      async (response) => {
        if (response.ok) {
          return await response.json()
        }
        return await response.json().then((body) => {
          throw body
        })
      },
    )
  }
}
