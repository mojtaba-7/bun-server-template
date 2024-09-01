export enum IValidMode {
  development = 'development',
  test = 'test',
  production = 'production'
}

const modeEnv = process.env.MODE as IValidMode | undefined;

const defaultPort = 1400;
const httpPortEnv = process.env.HTTP_PORT as number | undefined;

export const ENV = {
  mode: modeEnv ? modeEnv : IValidMode.development,
  port: httpPortEnv ? httpPortEnv : defaultPort
};
