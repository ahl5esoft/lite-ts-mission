import { MissionItemServiceBase } from './item-service-base';

export class MissionOnceItemService extends MissionItemServiceBase {
    protected get titleKey() {
        return this.enumItem.findLangKeys()[0];
    }
}