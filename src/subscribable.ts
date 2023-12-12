export type SubscribableListener<T> = (value: T) => void;

export class Subscribable<T> {
    private listeners: SubscribableListener<T>[] = [];

    subscribe(listener: SubscribableListener<T>): void {
        this.listeners.push(listener);
    }

    publish(value: T): void {
        for (const listener of this.listeners) {
            listener(value);
        }
    }
}
