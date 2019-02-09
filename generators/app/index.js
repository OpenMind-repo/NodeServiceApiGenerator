const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');

module.exports = class MainGenerator extends Generator {
  prompting() {
    // Have Yeoman greet the user.
    this.log(
      yosay(`Welcome to the shining ${chalk.red('generator-node-service-api-generator')} !`),
    );

    const prompts = [
      {
        type: 'input',
        name: 'serviceApiName',
        message: "What's the service name?",
        default: 'new-service-api',
      },
      {
        type: 'input',
        name: 'serviceDesc',
        message: 'tell me about this service !',
        default: 'this is our service',
      },
      {
        type: 'input',
        name: 'serviceAuthor',
        message: "What's the service author name?",
        default: 'Gerald Halomoan Samosir',
      },
      {
        type: 'input',
        name: 'License',
        message: 'this License belongs to ?',
        default: 'MIT',
      },
      {
        type: 'input',
        name: 'swaggerUser',
        message: 'Set swagger docs user',
        default: 'dev',
      },
      {
        type: 'input',
        name: 'swaggerPassword',
        message: 'Set swagger docs password',
        default: 'supersecretpassword',
      },
    ];
    /* eslint arrow-parens: off  */
    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      this.props = props;
    });
  }

  writing() {
    /* eslint  prefer-destructuring: off */
    const props = this.props;
    const copy = this.fs.copy.bind(this.fs);
    const copyTpl = this.fs.copyTpl.bind(this.fs);
    const tPath = this.templatePath.bind(this);
    const dPath = this.destinationPath.bind(this);

    copy(tPath('.editorconfig'), dPath('.editorconfig'));
    copy(tPath('.eslintrc.json'), dPath('.eslintrc.json'));
    copyTpl(tPath('.gitignore'), dPath('.gitignore'));
    copyTpl(tPath('package.json'), dPath('package.json'), props);
    copyTpl(tPath('config.js'), dPath('config.js'));
    copyTpl(tPath('config.json'), dPath('config.json'), props);
    copyTpl(tPath('app.js'), dPath('app.js'), props);
    copyTpl(tPath('README.md'), dPath('README.md'), props);
    copyTpl(tPath('tests/controllers.js'), dPath('tests/controllers.js'), props);
    copyTpl(tPath('controllers/index.js'), dPath('controllers/index.js'), props);
    copyTpl(tPath('controllers/sample.js'), dPath('controllers/sample.js'), props);
    copyTpl(tPath('controllers/docs/index.js'), dPath('controllers/docs/index.js'), props);
    copyTpl(tPath('configs/readme.md'), dPath('configs/readme.md'), props);
    copyTpl(tPath('libs/readme.md'), dPath('libs/readme.md'), props);
  }

  install() {
    this.installDependencies();
  }
};
