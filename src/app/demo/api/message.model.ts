export interface Message {
    unique_key: string;
    type_message: string;
    decoded_message: string | null;
    created_at: string;
    message_log: string | null;
    base64_message: string | null;
    device_model: string | null;
    decoded_value: string | null;
    name: string;
    communication: string | null;
    type_enum: string | null;
    log1: string | null;
    log2: string | null;
    log3: string | null;
    log4: string | null;
    log5: string | null;
    log6: string | null;
    log7: string | null;
    log8: string | null;
    log9: string | null;
    log10: string | null;
    log11: string | null;
    log12: string | null;
    devicemodel_message_id: string | null;
    dev_eui: string | null;
    app_id: number;
    time: string;
    gwid: string;
    rssi: string;
    snr: number;
    freq: number;
    dr: number;
    adr: boolean;
    device_class: string | null;
    f_cnt: number;
    f_port: number;
    confirmed: boolean;
    gws: string;
    dev_addr: string | null;
    battery_alert: boolean;
    empty_pipe: boolean;
    reverser_flow: boolean;
    over_range: boolean;
    temperature: string;
    ee_error: string | null;
    inlet_error: string | null;
    outlet_error: string | null;
    raw_reading: string | null;
    real_reading: number;
    valve_status: string | null;
    battery_voltage_status: string | null;
    serial_number: string | null;
    status1: string;
    status2: string;
    battery_percentage: number;
    unit: string | null;
    reporting_cycle: string | null;
    leakage_alarm: boolean;
    burst_alarm: boolean;
    tampering_alarm: boolean;
    freezing_alarm: boolean;
    transduce_alarm: string | null;
    recharge_count: string | null;
    emergency_water: string | null;
    balance: string | null;
    message_type: string | null;
    created_by: string | null;
    base_user: string | null;
}