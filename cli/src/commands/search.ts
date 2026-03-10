import axios from 'axios';
import chalk from 'chalk';
import ora from 'ora';

export async function searchCommand(query: string) {
  const spinner = ora('Searching themes...').start();

  try {
    const response = await axios.get('https://ricehub.sh/api/themes', {
      params: { q: query },
    });

    spinner.stop();

    const themes = response.data.themes;

    if (themes.length === 0) {
      console.log(chalk.yellow('No themes found matching your query.'));
      return;
    }

    console.log(chalk.bold(`\nFound ${themes.length} theme(s):\n`));

    themes.forEach((theme: any) => {
      console.log(chalk.cyan(theme.name));
      console.log(`  ${chalk.dim(theme.description)}`);
      console.log(`  ${chalk.gray(`WM: ${theme.wm} | Rating: ${theme.rating} | Downloads: ${theme.downloads}`)}`);
      console.log(`  ${chalk.gray(`Slug: ${theme.slug}`)}\n`);
    });
  } catch (error) {
    spinner.stop();
    console.error(chalk.red('Error searching themes:'), error);
  }
}
