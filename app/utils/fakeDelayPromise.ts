export const fakeDelayPromise = (delay: number, promise?: Promise<any>, forceError?: boolean) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (forceError) return reject("there was an error")

            return resolve(promise);
        }, delay);
    });
}  