export interface IRepository<T> {
  create(data: Partial<T>): Promise<T>;
  findAll(options?: any): Promise<T[]>;
  findById(id: number): Promise<T>;
  update(id: number, data: Partial<T>): Promise<T>;
  remove(id: number): Promise<void>;
}
