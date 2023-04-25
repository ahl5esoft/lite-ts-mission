import { IUnitOfWork } from 'lite-ts-db';
import { IUserService, UserValue } from 'lite-ts-user';
import { ValueService } from 'lite-ts-value';

import { MissionData } from './data';
import { IMissionFactory } from './i-factory';
import { MissionServiceBase } from './service-base';
import { UserMission } from './user';

export abstract class MissionItemServiceBase {
    private m_TitleKeys: string[];
    public get titleKeys() {
        this.m_TitleKeys = [
            this.titleKey,
            this.enumItem.conditions[0][0].count.toString()
        ];
        return this.m_TitleKeys;
    }

    protected abstract get titleKey(): string;

    public constructor(
        public enumItem: MissionData,
        protected userService: IUserService,
        protected missionService: MissionServiceBase,
    ) { }

    public async getCurrent(uow: IUnitOfWork) {
        const userValueService = this.userService.getModule<ValueService, UserValue>(UserValue);
        const count = await userValueService.getCount(uow, this.enumItem.conditions[0][0].valueType);
        const total = this.enumItem.conditions[0][0].count;
        return count >= total ? total : count;
    }

    public getIsComplete() {
        return this.missionService.getIsComplete(this.enumItem.value);
    }

    public getTotal() {
        return this.enumItem.conditions[0][0].count;
    }

    public async receive(uow: IUnitOfWork) {
        const isComplete = await this.missionService.getIsComplete(this.enumItem.value);
        if (isComplete)
            return;

        const userEntry = await this.userService.getModule<IMissionFactory, UserMission>(UserMission).userEntry;
        userEntry.mission[this.enumItem.value] = 1;

        await this.userService.getModule<ValueService, UserValue>(UserValue).update(uow, this.enumItem.rewardValues);
    }
}