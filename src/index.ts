import release from "./release"

/**
 * Run the release
 * @param options The options
 * @returns void
 */
export default function (options?: Record<string, any>) {
    release(options).catch((error) => {
        console.error(error)
        process.exit(1)
    })
}
