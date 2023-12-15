export type Subscriber<T> = (value: T) => void;

export class Subscribable<T> {
    private subscribers: Map<string | Symbol, Subscriber<T>> = new Map();

    subscribe(id: string | Symbol, listener: Subscriber<T>): void {
        this.subscribers.set(id, listener);
    }

    unsubscribe(id: string | Symbol): void {
        this.subscribers.delete(id);
    }

    publish(value: T): void {
        for (const listener of this.subscribers.values()) {
            listener(value);
        }
    }
}
