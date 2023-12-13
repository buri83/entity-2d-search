export type SubscribableListener<T> = (value: T) => void;

export class Subscribable<T> {
    private listeners: Map<string | Symbol, SubscribableListener<T>> = new Map();

    subscribe(id: string | Symbol, listener: SubscribableListener<T>): void {
        this.listeners.set(id, listener);
    }

    unsubscribe(id: string | Symbol): void {
        this.listeners.delete(id);
    }

    publish(value: T): void {
        for (const listener of this.listeners.values()) {
            listener(value);
        }
    }
}
