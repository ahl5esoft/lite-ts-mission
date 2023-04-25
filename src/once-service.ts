import { IUserService } from 'lite-ts-user';

import { MissionData } from './data';
import { MissionOnceItemService } from './once-item-service';
import { MissionServiceBase } from './service-base';

export class MissionOnceService extends MissionServiceBase {
    public constructor(
        private m_Items: MissionData[],
        userService: IUserService,
    ) {
        super(userService);
    }

    public async findItems() {
        return this.m_Items.map(r => {
            return new MissionOnceItemService(r, this.userService, this);
        });
    }
}