import { exec } from "./utils/cmd"
import { getPath } from "./utils/path"

const main = async () => {
  const rootDir = getPath()
  await exec("turbo run build --filter='@djalon/*'^...", {
    cwd: rootDir,
    name: "Building packages",
    successMessage: "Packages built",
  })
}

main()
