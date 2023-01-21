import { ApiPagedResponse, WhaleApiClient } from '@defichain/whale-api-client'
import { AddressToken } from '@defichain/whale-api-client/dist/api/address'
import { LoanVaultActive, LoanVaultState } from '@defichain/whale-api-client/dist/api/loan'
import { PriceTicker } from '@defichain/whale-api-client/dist/api/prices'

export class WhaleClient {
  private readonly client: WhaleApiClient

  constructor() {
    this.client = new WhaleApiClient({
      url: 'https://ocean.defichain.com',
      version: 'v0',
    })
  }

  async getBlockHeight(): Promise<number> {
    return this.client.stats.get().then((data) => data.count.blocks)
  }

  async getTokens(address: string): Promise<AddressToken[]> {
    return this.getAll(() => this.client.address.listToken(address, 200))
  }

  async getVaults(address: string): Promise<LoanVaultActive[]> {
    return this.getAll(() => this.client.address.listVault(address)).then((vaults) =>
      vaults.filter((v) => v.state !== LoanVaultState.IN_LIQUIDATION).map((v) => v as LoanVaultActive),
    )
  }

  async getPrices(): Promise<PriceTicker[]> {
    return this.getAll(() => this.client.prices.list(200))
  }

  private async getAll<T>(call: () => Promise<ApiPagedResponse<T>>, maxAmount: number = -1): Promise<T[]> {
    const pages = [await call()]
    let total = 0
    while (pages[pages.length - 1].hasNext && (maxAmount < 0 || total < maxAmount)) {
      try {
        pages.push(await this.client.paginate(pages[pages.length - 1]))
        total += pages[pages.length - 1].length
      } catch (e) {
        break
      }
    }

    return pages.flatMap((page) => page as T[])
  }
}
