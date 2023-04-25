import { EnumFactoryBase } from 'lite-ts-enum';
import { RpcBase } from 'lite-ts-rpc';
import { IUserService, UserFactoryBase } from 'lite-ts-user';

import { ChainGroup } from './chain-group';
import { MissionChainService } from './chain-service';
import { MissionData } from './data';
import { MissionOnceService } from './once-service';
import { MissionServiceBase } from './service-base';
import { UserMission } from './user';

export interface IMissionFactory {
    readonly userEntry: Promise<UserMission>;

    build(viewNo: number): Promise<MissionServiceBase>;
}

export class MissionFactory implements IMissionFactory {
    public static getUserEntryRoute = '/mission/get-entry';

    private m_UserEntry: Promise<UserMission>;
    public get userEntry() {
        this.m_UserEntry ??= new Promise<UserMission>(async (s, f) => {
            try {
                const resp = await this.m_Rpc.call<UserMission>({
                    isThrow: true,
                    route: MissionFactory.getUserEntryRoute,
                });
                s(resp.data);
            } catch (ex) {
                delete this.m_UserEntry;
                f(ex);
            }
        });
        return this.m_UserEntry;
    }

    private m_MissionService: Promise<{ [viewNo: number]: MissionServiceBase }>;
    protected get missionService() {
        this.m_MissionService ??= new Promise<{ [viewNo: number]: MissionServiceBase }>(async (s, f) => {
            try {
                const items = await this.m_EnumFactory.build({
                    app: 'mission',
                    areaNo: UserFactoryBase.areaNo,
                    ctor: MissionData,
                }).items;
                const missionService: { [viewNo: number]: MissionServiceBase } = {};
                const reduce: {
                    [viewNo: number]: Partial<{
                        onceItems: MissionData[];
                        chainGroup: ChainGroup;
                    }>
                } = {};
                for (const r of items) {
                    if (!reduce[r.viewNo]) {
                        if (r.chain) {
                            reduce[r.viewNo] = {
                                chainGroup: {}
                            };
                            missionService[r.viewNo] = new MissionChainService(reduce[r.viewNo].chainGroup, this.m_UserService);
                        } else {
                            reduce[r.viewNo] = {
                                onceItems: []
                            };
                            missionService[r.viewNo] = new MissionOnceService(reduce[r.viewNo].onceItems, this.m_UserService);
                        }
                    }

                    if (r.chain) {
                        r.chain.parent ??= 0;
                        reduce[r.viewNo].chainGroup[r.chain.parent] ??= [];
                        reduce[r.viewNo].chainGroup[r.chain.parent].push(r);
                    } else {
                        reduce[r.viewNo].onceItems.push(r);
                    }
                }
                s(missionService);
            } catch (ex) {
                f(ex);
            }
        });
        return this.m_MissionService;
    }

    public constructor(
        private m_UserService: IUserService,
        private m_EnumFactory: EnumFactoryBase,
        private m_Rpc: RpcBase,
    ) { }

    public async build(viewNo: number) {
        const missionService = await this.missionService;
        return missionService[viewNo];
    }
}