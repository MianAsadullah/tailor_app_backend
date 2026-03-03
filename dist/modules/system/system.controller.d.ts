export declare class SystemController {
    health(): {
        status: string;
        timestamp: string;
    };
    config(): {
        nodeEnv: string;
        port: number;
    };
}
