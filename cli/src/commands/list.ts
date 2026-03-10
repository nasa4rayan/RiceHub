import axios from 'axios';
import chalk from 'chalk';
import ora from 'ora';

export async function listCommand(wm: string) {
  const spinner = ora(`Listing ${wm} themes...`).start();

  try {
    const response = await axios.get('https://ricehub.sh/api/themes', {
      params: { wm },
    });

    spinner.stop();

    const themes = response.data.themes;

    if (themes.length === 0) {
      console.log(chalk.yellow(`No themes found for ${wm}.`));
      return;
    }

    console.log(chalk.bold(`\n${themes.length} ${wm.charAt(0).toUpperCase() + wm.slice(1)} theme(s):\n`));

    themes.forEach((theme: any) => {
      console.log(chalk.cyan(theme.name));
      console.log(`  ${chalk.dim(theme.description)}`);
      console.log(`  ${chalk.gray(`Rating: ${theme.rating} | Downloads: ${theme.downloads}`)}`);
      console.log(`  ${chalk.gray(`Slug: ${theme.slug}`)}\n`);
    });
  } catch (error) {
    spinner.stop();
    console.error(chalk.red('Error listing themes:'), error);
  }
}
