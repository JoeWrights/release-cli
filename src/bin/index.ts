/**
 * Release cli bin
 * @author Joe Wright
 */

import { Command } from "commander"
import run from "../index"

const program = new Command()

program
    .description("A CLI tool for releasing projects")
    .option("-v, --version", "output the current version")
    .option("-V, --version", "output the current version")
    .option("-c, --config <path>", "path to config file")
    .action((options) => {
        run(options)
    })
    .parse(process.argv)
