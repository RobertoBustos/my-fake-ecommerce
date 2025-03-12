export const fakeDelayPromise = (delay: number, promise?: Promise<unknown>, forceError?: boolean) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (forceError) return reject("there was an error")

            return resolve(promise);
        }, delay);
    });
}

export default {}