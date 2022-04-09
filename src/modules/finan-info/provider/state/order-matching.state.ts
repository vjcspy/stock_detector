import { Injectable } from '@nestjs/common';
import { StateManager } from '@module/core/provider/state-manager';
import { SyncOrderMatchingEffects } from '@module/finan-info/store/order-matching/order-matching.effects';

@Injectable()
export class OrderMatchingStateDeclaration {
  protected _init = false;
  constructor(
    protected stateManager: StateManager,
    private omEffects: SyncOrderMatchingEffects,
  ) {}
  public config() {
    if (this._init) {
      return;
    }

    this.stateManager.addFeatureEffect('sync-order-matching', this.omEffects);
    this._init = true;
  }
}
