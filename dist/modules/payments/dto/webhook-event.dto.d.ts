export declare class WebhookEventDto {
    provider: 'stripe' | 'jazzcash';
    eventType: string;
    signature?: string;
    payload: Record<string, unknown>;
}
