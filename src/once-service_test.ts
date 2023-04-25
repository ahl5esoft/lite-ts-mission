import { ok, } from 'assert';

import { MissionOnceItemService } from './once-item-service';
import { MissionOnceService as Self } from './once-service';

describe('src/once-service.ts', () => {
    it('.findItems()', async () => {
        const self = new Self(null, [{} as any], null);
        const res = await self.findItems();
        ok(res[0] instanceof MissionOnceItemService);
    });
});