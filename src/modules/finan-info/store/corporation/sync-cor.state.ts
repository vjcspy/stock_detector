export interface SyncCorState {
  page?: number;
  running?: boolean;
}

export const SyncCorStateFactory = (): SyncCorState => ({
  page: 0,
});
