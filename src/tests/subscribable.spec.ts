import { Subscribable } from "../subscribable";

type Payload = {
    id: string;
}

describe(Subscribable, () => {
    describe("When not listener subscribed", () => {
        it("Can call publish()", () => {
            const s = new Subscribable<Payload>();
            s.publish({ id: "test" });
        })
    })

    describe("Subscribe listener 2 and publish data", () => {
        it("Listener can be received published data", () => {
            const s = new Subscribable<Payload>();
            const payload: Payload = { id: "test" };

            const mockListener1 = jest.fn(() => { });
            const mockListener2 = jest.fn(() => { });

            s.subscribe(mockListener1);
            s.subscribe(mockListener2);
            s.publish(payload);

            expect(mockListener1).toHaveBeenCalledWith(payload);
            expect(mockListener1).toHaveBeenCalledTimes(1);

            expect(mockListener2).toHaveBeenCalledWith(payload);
            expect(mockListener2).toHaveBeenCalledTimes(1);
        })
    })
})