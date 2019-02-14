const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const _ = require('lodash');

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
      {
        type: 'list',
        name: 'databaseSelect',
        message: 'database you use ?',
        choices: ['Mysql', 'MongoDB', 'NoDatabase'],
      },
      {
        type: 'input',
        name: 'databaseHost',
        message: 'insert database host',
      },
      {
        type: 'input',
        name: 'databasePort',
        message: 'insert database port',
      },
      {
        type: 'input',
        name: 'databaseName',
        message: 'insert database name',
      },
      {
        type: 'input',
        name: 'databaseUser',
        message: 'insert database username',
      },
      {
        type: 'input',
        name: 'databasePassword',
        message: 'insert database password',
      },
      {
        type: 'confirm',
        name: 'NeedMultipart',
        message: 'this service need multipart ?',
        default: false,
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
    copyTpl(tPath('config.json'), tPath('config.json'), props);
    copyTpl(tPath('config.template.json'), tPath('config.template.json'), props);
    copyTpl(tPath('README.md'), dPath('README.md'), props);
    copyTpl(tPath('tests/controllers.js'), dPath('tests/controllers.js'), props);
    copyTpl(tPath('controllers/index.js'), dPath('controllers/index.js'), props);
    copyTpl(tPath('controllers/sample.js'), dPath('controllers/sample.js'), props);
    copyTpl(tPath('controllers/docs/index.js'), dPath('controllers/docs/index.js'), props);
    copyTpl(tPath('configs/readme.md'), dPath('configs/readme.md'), props);
    copyTpl(tPath('configs/codes.js'), dPath('configs/codes.js'), props);
    copyTpl(tPath('libs/readme.md'), dPath('libs/readme.md'), props);
    // database handle
    if (props.databaseSelect === 'Mysql') {
      copyTpl(tPath('app.js'), dPath('app.js'), props);
      // seeding config for mysql
      let configJSON = this.fs.readJSON(tPath('config.json'));
      let configJSONTemplate = this.fs.readJSON(tPath('config.template.json'));
      const updateConfigJSON = {
        DB_DIALECT: 'mysql',
        DB_HOST: props.databaseHost,
        DB_NAME: props.databaseName,
        DB_PASS: props.databasePassword,
        DB_PORT: props.databasePort,
        DB_USER: props.databaseUser,
      };
      const updateConfigJSONTemplate = {
        DB_DIALECT: 'mysql',
        DB_HOST: '__DB_HOST__',
        DB_NAME: '__DB_NAME__',
        DB_PASS: '__DB_PASS__',
        DB_PORT: '__DB_PORT__',
        DB_USER: '__DB_USER__',
      };
      configJSON = _.merge(configJSON, updateConfigJSON);
      configJSONTemplate = _.merge(configJSONTemplate, updateConfigJSONTemplate);
      this.fs.extendJSON(dPath('config.json'), configJSON);
      this.fs.extendJSON(dPath('config.template.json'), configJSONTemplate);

      // copy mysql configs database and migration config file
      copyTpl(tPath('configs/database.js'), dPath('configs/database.js'), props);
      copyTpl(tPath('configs/migration.js'), dPath('configs/migration.js'), props);
    } else if (props.databaseSelect === 'MongoDB') {
      copyTpl(tPath('app.mongo.js'), dPath('app.js'), props);

      // seeding config for mongodb
      let configJSON = this.fs.readJSON(tPath('config.json'));
      let configJSONTemplate = this.fs.readJSON(tPath('config.template.json'));
      const updateConfigJSON = {
        MONGODB_HOST: props.databaseHost,
        MONGODB_PORT: props.databasePort,
        MONGODB_USER: props.databaseUser,
        MONGODB_PASS: props.databasePassword,
        MONGODB_NAME: props.databaseName,
      };
      const updateConfigJSONTemplate = {
        MONGODB_HOST: '__MONGODB_HOST__',
        MONGODB_PORT: '__MONGODB_PORT__',
        MONGODB_USER: '__MONGODB_USER__',
        MONGODB_PASS: '__MONGODB_PASS__',
        MONGODB_NAME: '__MONGODB_NAME__',
      };
      configJSON = _.merge(configJSON, updateConfigJSON);
      configJSONTemplate = _.merge(configJSONTemplate, updateConfigJSONTemplate);
      this.fs.extendJSON(dPath('config.json'), configJSON);
      this.fs.extendJSON(dPath('config.template.json'), configJSONTemplate);
    } else if (props.databaseSelect === 'NoDatabase') {
      copyTpl(tPath('app.js'), dPath('app.js'), props);
    }

    if (props.databaseSelect !== 'NoDatabase') {
      copyTpl(tPath('config.json'), tPath('config.json'), props);
      copyTpl(tPath('config.template.json'), tPath('config.template.json'), props);
    }
  }

  install() {
    const props = this.props;
    this.installDependencies();

    // database handle database install
    if (props.databaseSelect === 'Mysql') {
      this.npmInstall([
        'mysql2',
        'sequelize',
        'sequelize-cli',
      ]);
    } if (props.databaseSelect === 'MongoDB') {
      this.npmInstall([
        'mongoose',
        'mongoose-paginate',
        'mongoose-slug-generator',
      ]);
    }
    // need multipart
    if (props.NeedMultipart === true) {
      this.npmInstall([
        'multer',
      ]);
    }
  }
};
