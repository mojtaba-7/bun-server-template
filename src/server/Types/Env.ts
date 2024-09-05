export enum IValidMode {
  development = 'development',
  test = 'test',
  production = 'production'
}

async function checkFileExists(fileAddress: string): Promise<boolean> {
  const file = Bun.file(fileAddress);

  return file.exists();
}

const modeEnv = process.env.MODE as IValidMode | undefined;

const defaultPort = 1400;
const httpPortEnv = process.env.HTTP_PORT as number | undefined;
const appLogFile = process.env.APP_LOG_FILE as string;

const isAppLogFileExist = await checkFileExists(appLogFile);
if (!isAppLogFileExist) {
  throw new Error(`Log file with address ${appLogFile} does not exists!`);
}
export const ENV = {
  mode: modeEnv ? modeEnv : IValidMode.development,
  port: httpPortEnv ? httpPortEnv : defaultPort,
  appLogFile: appLogFile
};
