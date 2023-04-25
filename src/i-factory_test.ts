import { deepStrictEqual, ok } from 'assert';
import { Enum, EnumFactoryBase, EnumItem } from 'lite-ts-enum';
import { Mock } from 'lite-ts-mock';
import { RpcBase } from 'lite-ts-rpc';
import { UserFactoryBase } from 'lite-ts-user';

import { MissionChainService } from './chain-service';
import { MissionData } from './data';
import { MissionFactory as Self } from './i-factory';
import { MissionOnceService } from './once-service';
import { MissionServiceBase } from './service-base';

describe('src/i-factory.ts', () => {
    describe('MissionFactory', () => {
        it('.userEntry', async () => {
            const mockRpc = new Mock<RpcBase>();
            const self = new Self(null, null, mockRpc.actual);

            mockRpc.expectReturn(
                r => r.call({
                    isThrow: true,
                    route: Self.getUserEntryRoute,
                }),
                {
                    data: {}
                }
            );

            const res = await self.userEntry;
            await self.userEntry;
            deepStrictEqual(res, {});
        });

        describe('.missionService[protected]', () => {
            it('chain', async () => {
                const mockEnumFactory = new Mock<EnumFactoryBase>();
                const self = new Self(null, mockEnumFactory.actual, null);

                const mockEnum = new Mock<Enum<EnumItem>>({
                    items: [{
                        chain: {},
                        viewNo: 1
                    }]
                });
                mockEnumFactory.expectReturn(
                    r => r.build({
                        app: 'mission',
                        areaNo: UserFactoryBase.areaNo,
                        ctor: MissionData,
                    }),
                    mockEnum.actual
                );

                const task = Reflect.get(self, 'missionService') as Promise<{ [viewNo: number]: MissionServiceBase }>;
                const res = await task;
                await task;
                ok(res[1] instanceof MissionChainService);
            });

            it('once', async () => {
                const mockEnumFactory = new Mock<EnumFactoryBase>();
                const self = new Self(null, mockEnumFactory.actual, null);

                const mockEnum = new Mock<Enum<EnumItem>>({
                    items: [{
                        viewNo: 1
                    }]
                });
                mockEnumFactory.expectReturn(
                    r => r.build({
                        app: 'mission',
                        areaNo: UserFactoryBase.areaNo,
                        ctor: MissionData,
                    }),
                    mockEnum.actual
                );

                const task = Reflect.get(self, 'missionService') as Promise<{ [viewNo: number]: MissionServiceBase }>;
                const res = await task;
                await task;
                ok(res[1] instanceof MissionOnceService);
            });
        });
    });
});