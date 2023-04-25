import { Mock } from 'lite-ts-mock';
import { MissionData } from './data';
import { MissionOnceItemService as Self } from './once-item-service';
import { strictEqual } from 'assert';

describe('src/once-item-service.ts', () => {
    it('.titleKey[protected]', () => {
        const mockEnumItem = new Mock<MissionData>();
        const self = new Self(mockEnumItem.actual, null, null, null);

        mockEnumItem.expectReturn(
            r => r.findLangKeys(),
            ['tt', 'aa']
        );

        const res = Reflect.get(self, 'titleKey');
        strictEqual(res, 'tt');
    });
});