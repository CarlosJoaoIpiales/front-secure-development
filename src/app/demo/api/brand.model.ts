import { Model } from './model.model';

export interface Brand {
    unique_key: string;
    name: string;
    models: Model[];
}