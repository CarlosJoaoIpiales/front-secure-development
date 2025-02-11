export interface Gateway {
    unique_key?: string;       
    serial: string;           
    name: string;             
    type: string;             
    region: string;           
    sub_red: string;          
    state: boolean;           
    class_b: boolean;
    pktfwd: boolean;
    latitude: number;
    longitude: number;
    mqtt: boolean;
    created_at?: string;
    unique_key_company: string;
    comunication: string,
    mac_direction: string,
}
