import { IUserService } from 'lite-ts-user';

import { ChainGroup } from './chain-group';
import { MissionChainItemService } from './chain-item-service';
import { MissionData } from './data';
import { MissionItemServiceBase } from './item-service-base';
import { MissionServiceBase } from './service-base';

export class MissionChainService extends MissionServiceBase {
    public constructor(
        private m_Group: ChainGroup,
        userService: IUserService,
    ) {
        super(userService);
    }

    public async buildItem(enumItem: MissionData) {
        const isComplete = await this.getIsComplete(enumItem.value);
        if (isComplete) {
            const children = this.m_Group[enumItem.value];
            return children?.length ? await this.buildItem(children[0]) : null;
        }

        return new MissionChainItemService(enumItem, this.userService, this);
    }

    public async findItems() {
        const res: MissionItemServiceBase[] = [];
        for (const r of this.m_Group[0]) {
            const itemService = await this.buildItem(r);
            if (itemService)
                res.push(itemService);
        }
        return res;
    }
}