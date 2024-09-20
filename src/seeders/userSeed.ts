import { IUserRole, UserModel } from '@models*';
import { userRepository } from '@repositories';
import { MongoServiceConfig } from '@serverConfigs';
import { sessionRepository } from '../repositories/sessionRepository';
import { ISessionLanguage, ISessionPlatform, ISessionStatus } from '../models/session';

const readline = require('readline');

// Create an interface for user input/output
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to ask questions
const askQuestion = (query: string): Promise<string> => {
  return new Promise((resolve) => rl.question(query, (answer: string) => resolve(answer)));
};

// Main function to run the CLI application
const main = async () => {
  const questionColor = '\x1b[32m';
  const name = await askQuestion(`${questionColor}Name: `);
  const username = await askQuestion(`${questionColor}Username: `);
  const password = await askQuestion(`${questionColor}Password: `);
  let role;

  // Loop to ensure valid role input
  while (true) {
    role = await askQuestion('Role (user/superAdmin): ');
    if (role === IUserRole.user || role === IUserRole.superAdmin) {
      break;
    }
    console.log('Invalid role, please enter either "user" or "superAdmin".');
  }

  // Create user
  await MongoServiceConfig.start();
  const user = await userRepository.create({
    name: name,
    username: username,
    password: password,
    roles: [role]
  });

  const session = await sessionRepository.create({
    user: user._id,
    token: sessionRepository.newToken,
    status: ISessionStatus.active,
    language: ISessionLanguage.english,
    platform: ISessionPlatform.system
  });
  // Print out the collected information
  console.log(
    `\nInformation collected:\nName: ${name}\nUsername: ${username}\nPassword: ${password}\nRole: ${role}\nToken:\n${session.token}`
  );

  // Close the input stream
  rl.close();
  setTimeout(() => {
    process.exit();
  }, 2000);
};

// Run the app
main();
