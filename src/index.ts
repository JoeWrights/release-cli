import release from "./release"

/**
 * Run the release
 * @param options The options
 * @returns void
 */
export default function(options?: Record<string, any>) {
    release(options).catch((error) => {
        console.error(error)
        // eslint-disable-next-line unicorn/no-process-exit
        process.exit(1)
    })
}
