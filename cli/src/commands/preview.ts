import axios from 'axios';
import chalk from 'chalk';
import ora from 'ora';

export async function previewCommand(slug: string) {
  const spinner = ora(`Loading theme details for ${slug}...`).start();

  try {
    const response = await axios.get(`https://ricehub.sh/api/themes/${slug}`);

    spinner.stop();

    const theme = response.data;

    console.log(chalk.bold(`\n${theme.name}\n`));
    console.log(chalk.dim(theme.description));
    console.log();

    console.log(chalk.bold('Configuration:'));
    console.log(`  Window Manager: ${chalk.cyan(theme.wm)}`);
    console.log(`  GTK Theme: ${chalk.cyan(theme.gtkTheme)}`);
    console.log(`  Terminal: ${chalk.cyan(theme.terminal)}`);
    console.log(`  Compositor: ${chalk.cyan(theme.compositor)}`);
    console.log(`  Bar: ${chalk.cyan(theme.bar)}`);
    console.log();

    console.log(chalk.bold('Dependencies:'));
    console.log(`  Common: ${theme.dependencies.common.join(', ')}`);
    console.log(`  Arch: ${theme.dependencies.arch.join(', ')}`);
    console.log(`  Debian: ${theme.dependencies.debian.join(', ')}`);
    console.log();

    console.log(chalk.bold('Distro Compatibility:'));
    Object.entries(theme.distros).forEach(([distro, status]: [string, any]) => {
      const statusColor = status === 'verified' ? chalk.green : status === 'partial' ? chalk.yellow : chalk.gray;
      console.log(`  ${distro.charAt(0).toUpperCase() + distro.slice(1)}: ${statusColor(status)}`);
    });
    console.log();

    console.log(chalk.bold('Stats:'));
    console.log(`  Rating: ${chalk.yellow('★')} ${theme.rating} (${theme.totalRatings} ratings)`);
    console.log(`  Downloads: ${theme.downloads}`);
    console.log(`  Version: ${theme.version}`);
    console.log(`  License: ${theme.license}`);
    console.log();

    console.log(chalk.bold('Install command:'));
    console.log(chalk.cyan(`  bash <(curl -fsSL https://ricehub.sh/install/${theme.wm}/${theme.slug}.sh)`));
  } catch (error) {
    spinner.stop();
    console.error(chalk.red('Error loading theme details:'), error);
  }
}
