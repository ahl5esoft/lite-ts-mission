import { EnumItem } from 'lite-ts-enum';
import { Value, ValueCondition } from 'lite-ts-value';

export class MissionData extends EnumItem {
    public static ctor = 'MissionData';

    public viewNo: number;
    public rewardValues: Value[];
    public conditions: ValueCondition[][];
    public chain?: {
        type: number;
        parent: number;
    };
}