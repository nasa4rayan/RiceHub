import axios from 'axios';
import chalk from 'chalk';
import inquirer from 'inquirer';
import ora from 'ora';

export async function installCommand(slug: string, options: any) {
  const spinner = ora(`Loading theme ${slug}...`).start();

  try {
    const response = await axios.get(`https://ricehub.sh/api/themes/${slug}`);
    const theme = response.data;
    spinner.stop();

    console.log(chalk.bold(`\n${theme.name}\n`));
    console.log(chalk.dim(theme.description));
    console.log();

    console.log(chalk.bold('This theme will:'));
    console.log(`  • Install packages: ${theme.dependencies.common.join(', ')}`);
    console.log(`  • Copy configuration files`);
    console.log(`  • Backup existing configs to ~/.config/ricehub-backup-<timestamp>`);
    console.log();

    if (options.dryRun) {
      console.log(chalk.yellow('DRY RUN MODE - No changes will be made\n'));
    }

    const { confirm } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirm',
        message: 'Do you want to continue?',
        default: false,
      },
    ]);

    if (!confirm) {
      console.log(chalk.yellow('Installation cancelled.'));
      return;
    }

    const installSpinner = ora('Generating install script...').start();

    const params = new URLSearchParams();
    if (options.distro) params.append('distro', options.distro);
    if (options.dryRun) params.append('dry-run', 'true');
    if (!options.fonts) params.append('no-fonts', 'true');
    if (!options.icons) params.append('no-icons', 'true');
    if (options.rollbackOnFail) params.append('rollback-on-fail', 'true');

    const scriptResponse = await axios.get(
      `https://ricehub.sh/api/themes/${slug}/install-script?${params.toString()}`
    );

    installSpinner.stop();

    console.log(chalk.bold('\nInstall command:'));
    console.log(chalk.cyan(`  ${scriptResponse.data.command}`));
    console.log();

    const { runNow } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'runNow',
        message: 'Run the install command now?',
        default: false,
      },
    ]);

    if (runNow) {
      console.log(chalk.yellow('\nNote: This will execute the install script in your terminal.'));
      console.log(chalk.yellow('Make sure you understand what it does before proceeding.\n'));

      const { finalConfirm } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'finalConfirm',
          message: 'Are you sure you want to run the install script?',
          default: false,
        },
      ]);

      if (finalConfirm) {
        console.log(chalk.cyan(`\nRunning: ${scriptResponse.data.command}\n`));
        console.log(chalk.gray('(Command execution would happen here in production)\n'));
      } else {
        console.log(chalk.yellow('Installation cancelled.'));
      }
    } else {
      console.log(chalk.green('\nYou can run the install command manually when ready.'));
    }
  } catch (error) {
    spinner.stop();
    console.error(chalk.red('Error installing theme:'), error);
  }
}
