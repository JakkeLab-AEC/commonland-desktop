export class DefaultDimensions {
    private shoringPostRadius: number

    private constructor() {
        this.shoringPostRadius = 1;
        DefaultDimensions.instance = this;
    }

    getDims() {
        return {
            shoringPostRadius: this.shoringPostRadius,
        }
    }

    private static instance: DefaultDimensions

    // static initiate() {
    //     DefaultDimensions.instance = new DefaultDimensions();
    // }

    static getInstance() {
        return DefaultDimensions.instance;
    }
}