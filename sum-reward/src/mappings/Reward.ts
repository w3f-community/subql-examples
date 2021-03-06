import {SumReward} from '../types/models/SumReward';
import {SubstrateEvent} from "@subql/types";
import {Balance} from '@polkadot/types/interfaces';

export async function handleBond(event: SubstrateEvent): Promise<void> {
    const {event: {data: [account, balance]}} = event;
    try{
        await SumReward.get(account.toString());
    }catch (e) {
        const entity = new SumReward(account.toString());
        entity.accountReward = BigInt(0);
        entity.accountSlash = BigInt(0);
        entity.accountTotal = BigInt(0);
        await entity.save();
    }
}


export async function handleReward(event: SubstrateEvent): Promise<void> {
    const {event: {data: [account, newReward]}} = event;
    const entity = await SumReward.get(account.toString());

    entity.accountReward = entity.accountReward + (newReward as Balance).toBigInt();
    entity.accountTotal = entity.accountReward - entity.accountSlash;
    await entity.save();
}

export async function handleSlash(event: SubstrateEvent): Promise<void> {
    const {event: {data: [account, newSlash]}} = event;
    const entity = await SumReward.get(account.toString());

    entity.accountSlash = entity.accountSlash + (newSlash as Balance).toBigInt();
    entity.accountTotal = entity.accountReward - entity.accountSlash;
    await entity.save();
}
