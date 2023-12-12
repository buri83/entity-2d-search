export type SubscribableListener<T> = (value: T) => void;
export declare class Subscribable<T> {
    private listeners;
    subscribe(listener: SubscribableListener<T>): void;
    publish(value: T): void;
}
