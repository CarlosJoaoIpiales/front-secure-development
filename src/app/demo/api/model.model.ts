import { Brand } from './brand.model';

export interface Model {
    unique_key: string;
    name: string;
    brand: Brand;
}