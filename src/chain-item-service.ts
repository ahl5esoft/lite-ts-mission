import { IUnitOfWork } from 'lite-ts-db';

import { MissionChainService } from './chain-service';
import { MissionItemServiceBase } from './item-service-base';

export class MissionChainItemService extends MissionItemServiceBase {
    protected get titleKey() {
        return `ViewData-${this.enumItem.viewNo}-chain-${this.enumItem.chain.type}`;
    }

    public async receive(uow: IUnitOfWork) {
        await super.receive(uow);

        return await (this.missionService as MissionChainService).buildItem(this.enumItem);
    }
}