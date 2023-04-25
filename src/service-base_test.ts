import { ok, strictEqual } from 'assert';
import { Mock } from 'lite-ts-mock';
import { IUserService } from 'lite-ts-user';

import { MissionServiceBase } from './service-base';
import { UserMission } from './user';

class Self extends MissionServiceBase {
    public async findItems() {
        return [];
    }
}

describe('src/service-base.ts', () => {
    describe('.getIsComplete(no: number)', () => {
        it('ok', async () => {
            const mockUserService = new Mock<IUserService>();
            const self = new Self(mockUserService.actual);

            mockUserService.expectReturn(
                r => r.getModule(UserMission),
                {
                    userEntry: {
                        mission: {
                            1: 2
                        }
                    }
                }
            );

            const res = await self.getIsComplete(1);
            ok(res);
        });

        it('f', async () => {
            const mockUserService = new Mock<IUserService>();
            const self = new Self(mockUserService.actual);

            mockUserService.expectReturn(
                r => r.getModule(UserMission),
                {
                    userEntry: {
                        mission: {}
                    }
                }
            );

            const res = await self.getIsComplete(1);
            strictEqual(res, false);
        });
    });
});