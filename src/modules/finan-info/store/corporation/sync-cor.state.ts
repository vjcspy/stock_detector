export interface SyncCorState {
  page?: number;
}

export const SyncCorStateFactory = (): SyncCorState => ({
  page: 0,
});
