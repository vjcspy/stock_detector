import { Injectable } from '@nestjs/common';

@Injectable()
export class AnalysisYearIndexService {
  get analysisCode() {
    return this._analysisCode;
  }

  set analysisCode(value: string) {
    this._analysisCode = value;
  }
  get code() {
    return this._code;
  }

  set code(value: string) {
    this._code = value;
  }

  private _code: string;

  private _analysisCode: string;

  stockGetData(field?: string) {
    return {};
  }

  filterT1(filterValue: any) {
    return [];
  }
}
