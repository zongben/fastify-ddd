export interface IService {
  handle(...args: any[]): Promise<any> | any;
}
