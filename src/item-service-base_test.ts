import { deepStrictEqual, strictEqual } from 'assert';
import { Enum, EnumCcItem, EnumFactoryBase, EnumItem } from 'lite-ts-enum';
import { Mock } from 'lite-ts-mock';
import { IUserService, UserFactoryBase, UserValue } from 'lite-ts-user';
import { ValueService, ValueTypeData } from 'lite-ts-value';

import { MissionData } from './data';
import { MissionItemServiceBase } from './item-service-base';
import { MissionServiceBase } from './service-base';
import { UserMission } from './user';

class Self extends MissionItemServiceBase {
    protected get titleKey() {
        return 'title';
    }
}

describe('src/item-service-base.ts', () => {
    it('.rewards', async () => {
        const mockEnumFactory = new Mock<EnumFactoryBase>();
        const self = new Self(
            EnumCcItem.create({
                conditions: [],
                rewardValues: [{
                    count: 1,
                    valueType: 2
                }, {
                    count: 3,
                    valueType: 4
                }],
                value: 1,
                viewNo: 2,
            } as EnumItem, 'test') as MissionData,
            null,
            mockEnumFactory.actual,
            null
        );

        const mockValueType2 = new Mock<EnumCcItem>();
        const mockValueType4 = new Mock<EnumCcItem>();
        const mockEnum = new Mock<Enum<EnumCcItem>>({
            allItem: {
                2: mockValueType2.actual,
                4: mockValueType4.actual
            }
        });
        mockEnumFactory.expectReturn(
            r => r.build({
                app: 'config',
                areaNo: UserFactoryBase.areaNo,
                name: ValueTypeData.ctor
            }),
            mockEnum.actual
        );

        mockValueType2.expectReturn(
            r => r.getAssetPath(),
            '22'
        );

        mockValueType4.expectReturn(
            r => r.getAssetPath(),
            '44'
        );

        const res = await self.rewardVms;
        deepStrictEqual(res, [{
            _index: 1,
            count: 1,
            icon: '22'
        }, {
            _index: 2,
            count: 3,
            icon: '44'
        }]);
    });

    it('.titleKeys', () => {
        const self = new Self({
            conditions: [
                [{
                    count: 10
                }]
            ],
        } as MissionData, null, null, null);

        deepStrictEqual(self.titleKeys, ['title', '10']);
    });

    describe('.getCurrent(uow: IUnitOfWork)', () => {
        it('ok', async () => {
            const mockUserService = new Mock<IUserService>();
            const self = new Self({
                conditions: [
                    [{
                        count: 12,
                        valueType: 1,
                    }]
                ],
            } as MissionData, mockUserService.actual, null, null);

            const mockValueService = new Mock<ValueService>();
            mockUserService.expectReturn(
                r => r.getModule(UserValue),
                mockValueService.actual
            );

            mockValueService.expectReturn(
                r => r.getCount(null, 1),
                11,
            );

            const res = await self.getCurrent(null);
            strictEqual(res, 11);
        });

        it('> total', async () => {
            const mockUserService = new Mock<IUserService>();
            const self = new Self({
                conditions: [
                    [{
                        count: 10,
                        valueType: 1
                    }]
                ],
            } as MissionData, mockUserService.actual, null, null);

            const mockValueService = new Mock<ValueService>();
            mockUserService.expectReturn(
                r => r.getModule(UserValue),
                mockValueService.actual
            );

            mockValueService.expectReturn(
                r => r.getCount(null, 1),
                11,
            );

            const res = await self.getCurrent(null);
            strictEqual(res, 10);
        });
    });

    it('.getIsComplete()', async () => {
        const mockMissionService = new Mock<MissionServiceBase>();
        const self = new Self({
            value: 1
        } as MissionData, null, null, mockMissionService.actual);

        mockMissionService.expectReturn(
            r => r.getIsComplete(1),
            false
        );

        const res = await self.getIsComplete();
        strictEqual(res, false);
    });

    it('.receive(uow: IUnitOfWork)', async () => {
        const mockUserService = new Mock<IUserService>();
        const mockMissionService = new Mock<MissionServiceBase>();
        const self = new Self({
            rewardValues: [{
                count: 1,
                valueType: 2
            }, {
                count: 3,
                valueType: 4
            }],
            value: 1
        } as MissionData, mockUserService.actual, null, mockMissionService.actual);

        mockMissionService.expectReturn(
            r => r.getIsComplete(1),
            false
        );

        const userMissionEntry = {
            mission: {}
        };
        mockUserService.expectReturn(
            r => r.getModule(UserMission),
            {
                userEntry: userMissionEntry
            }
        );

        const mockValueService = new Mock<ValueService>();
        mockUserService.expectReturn(
            r => r.getModule(UserValue),
            mockValueService.actual
        );

        mockValueService.expected.update(null, [{
            count: 1,
            valueType: 2
        }, {
            count: 3,
            valueType: 4
        }]);

        await self.receive(null);
    });
});