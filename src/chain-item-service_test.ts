import { strictEqual } from 'assert';
import { Mock } from 'lite-ts-mock';

import { MissionChainItemService as Self } from './chain-item-service';
import { MissionChainService } from './chain-service';
import { MissionData } from './data';
import { MissionItemServiceBase } from './item-service-base';

describe('src/chain-item-service', () => {
    it('.titleKey[protected]', () => {
        const self = new Self({
            chain: {
                type: 1
            },
            viewNo: 2
        } as MissionData, null, null, null);
        const res = Reflect.get(self, 'titleKey');
        strictEqual(res, 'ViewData-2-chain-1');
    });

    it('.receive(uow: IUnitOfWork)', async () => {
        const mockMissionService = new Mock<MissionChainService>();
        const enumItem = {
            value: 1,
        } as MissionData;
        const self = new Self(enumItem, null, null, mockMissionService.actual);

        mockMissionService.expectReturn(
            r => r.getIsComplete(1),
            true
        );

        const mockMissionItemService = new Mock<MissionItemServiceBase>();
        mockMissionService.expectReturn(
            r => r.buildItem(enumItem),
            mockMissionItemService.actual
        );

        const res = await self.receive(null);
        strictEqual(res, mockMissionItemService.actual);
    });
});