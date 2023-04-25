import { deepStrictEqual, ok, strictEqual } from 'assert';

import { MissionChainItemService } from './chain-item-service';
import { MissionChainService as Self } from './chain-service';
import { MissionData } from './data';

describe('src/chain-service.ts', () => {
    describe('.buildItem(enumItem: MissionData)', () => {
        it('ok', async () => {
            const self = new Self(null, null, null);

            const enumItem = {
                value: 1
            } as MissionData;
            Reflect.set(self, 'getIsComplete', (arg: any) => {
                strictEqual(arg, enumItem.value);
                return false;
            });

            const res = await self.buildItem(enumItem);
            ok(res instanceof MissionChainItemService);
        });

        it('isComplete', async () => {
            const childEnumItem = {
                value: 2
            } as MissionData;
            const self = new Self(null, {
                1: [childEnumItem]
            }, null);

            const enumItem = {
                value: 1
            } as MissionData;
            const buildItemAsserts = [
                enumItem.value,
                childEnumItem.value
            ];
            Reflect.set(self, 'getIsComplete', (arg: any) => {
                strictEqual(
                    buildItemAsserts.shift(),
                    arg,
                );
                return buildItemAsserts.length;
            });

            const res = await self.buildItem(enumItem);
            ok(res instanceof MissionChainItemService);
        });
    });

    it('.findItems()', async () => {
        const items = [{
            value: 1
        }, {
            value: 2
        }, {
            value: 3
        }];
        const self = new Self(null, {
            0: [...items] as any
        }, null);

        Reflect.set(self, 'buildItem', (arg: any) => {
            strictEqual(
                arg,
                items.shift(),
            );
            return arg.value;
        });

        const res = await self.findItems();
        deepStrictEqual(res, [1, 2, 3]);
    });
});