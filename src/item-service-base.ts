import { IUnitOfWork } from 'lite-ts-db';
import { EnumCcItem, EnumFactoryBase } from 'lite-ts-enum';
import { IUserService, UserFactoryBase, UserValue } from 'lite-ts-user';
import { ValueService, ValueTypeData } from 'lite-ts-value';

import { MissionData } from './data';
import { IMissionFactory } from './i-factory';
import { MissionServiceBase } from './service-base';
import { UserMission } from './user';

type RewardVm = {
    _index: number;
    count: number;
    icon: string;
};

export abstract class MissionItemServiceBase {
    private m_RewardVms: Promise<RewardVm[]>;
    public get rewardVms() {
        this.m_RewardVms ??= new Promise<RewardVm[]>(async (s, f) => {
            try {
                const res: RewardVm[] = [];
                const allValueType = await this.enumFactory.build<EnumCcItem>({
                    app: 'config',
                    areaNo: UserFactoryBase.areaNo,
                    name: ValueTypeData.ctor
                }).allItem;
                for (const [i, r] of this.enumItem.rewardValues.entries()) {
                    res.push({
                        _index: i + 1,
                        count: r.count,
                        icon: allValueType[r.valueType].getAssetPath(),
                    });
                }
                s(res);
            } catch (ex) {
                delete this.m_RewardVms;
                f(ex);
            }
        });
        return this.m_RewardVms;
    }

    public get total() {
        return this.enumItem.conditions[0][0].count;
    }

    private m_TitleKeys: string[];
    public get titleKeys() {
        this.m_TitleKeys ??= [
            this.titleKey,
            this.total.toString()
        ];
        return this.m_TitleKeys;
    }

    protected abstract get titleKey(): string;

    public constructor(
        public enumItem: MissionData,
        protected userService: IUserService,
        protected enumFactory: EnumFactoryBase,
        protected missionService: MissionServiceBase,
    ) { }

    public async getCurrent(uow: IUnitOfWork) {
        const userValueService = this.userService.getModule<ValueService, UserValue>(UserValue);
        let current = await userValueService.getCount(uow, this.enumItem.conditions[0][0].valueType);
        return current > this.total ? this.total : current;
    }

    public getIsComplete() {
        return this.missionService.getIsComplete(this.enumItem.value);
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