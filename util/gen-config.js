const GitHub = require('github-api');
const fs = require('fs').promises;

let githubKey;
let env;
let config;

function setupEnvironment() {
  githubKey = process.env.GITHUB_KEY;
  if (!githubKey) {
    throw new Error('No Github key set, please set the env variable GITHUB_KEY');
  }
  if (process.argv.length < 3) {
    throw new Error('No enviorment specified, please supply as first command line argument');
  }
  env = process.argv[2];
}

async function getConfigFromGithub() {
  console.log(`Getting config ${env} from github`);

  const gh = new GitHub({
    token: githubKey
  });

  // Get repo
  const repo = await gh.getRepo('herpkeeper', 'herp-keeper-config');

  // Now get proper config
  const contents = await repo.getContents('master', 'web/environment.local.ts');

  // Now decode as ascii text since it's a typescript file
  const buff = Buffer.from(contents.data.content, 'base64');
  const text = buff.toString('ascii');
  config = text;
}

async function outputConfig() {
  const fileName = `src/environments/environment.${env}.ts`;
  console.log(`Outputting config to ${fileName}`);

  await fs.writeFile(fileName, config);
}

(async () => {
  try {
    setupEnvironment();
    await getConfigFromGithub();
    await outputConfig();
  } catch (err) {
    console.log(`Failed to generate config: ${err}`);
    process.exit(0);
  }
})();
