import { MissionData } from './data';
import { MissionItemServiceBase } from './item-service-base';

export class MissionOnceItemService extends MissionItemServiceBase {
    protected get titleKey() {
        return [MissionData.ctor, this.enumItem.value].join('-');
    }
}