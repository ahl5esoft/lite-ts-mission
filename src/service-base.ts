import { IUserService } from 'lite-ts-user';

import { IMissionFactory } from './i-factory';
import { MissionItemServiceBase } from './item-service-base';
import { UserMission } from './user';

export abstract class MissionServiceBase {
    public constructor(
        protected userService: IUserService,
    ) { }

    public async getIsComplete(no: number) {
        const userEntry = await this.userService.getModule<IMissionFactory, UserMission>(UserMission).userEntry;
        return !!userEntry.mission[no];
    }

    public abstract findItems(): Promise<MissionItemServiceBase[]>;
}