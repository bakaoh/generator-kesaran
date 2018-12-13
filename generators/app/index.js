'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const ejs = require('ejs');

module.exports = class extends Generator {
  _getProjectPath() {
    let goSrc = `${process.env.GOPATH}src/`;
    let projectPath = process.env.LOCAL_PATH || this.destinationRoot();
    var index = projectPath.indexOf(goSrc);
    return index === -1
      ? undefined
      : projectPath.substring(index + goSrc.length);
  }

  initializing() {
    this.projectPath = this._getProjectPath();
    this.stop = !this.projectPath;
    if (this.stop) {
      this.log(
        `please generate project in sub folder of '${chalk.red('$GOPATH/src')}'`
      );
    }
  }

  prompting() {
    if (this.stop) {
      return;
    }

    this.log(
      yosay(`Welcome to the wondrous ${chalk.red('kesaran')} generator!`)
    );

    const prompts = [
      {
        type: 'input',
        name: 'projectName',
        message: 'Please type your project name'
      },
      {
        type: 'input',
        name: 'servicePackage',
        message: 'Please type your service package',
        default: 'service'
      },
      {
        type: 'input',
        name: 'serviceName',
        message: 'Please type your service name',
        default: 'Service'
      }
    ];

    return this.prompt(prompts).then(props => {
      this.props = props;
    });
  }

  writing() {
    if (this.stop) {
      return;
    }

    const tplMap = {
      'cmd/_root.go': 'cmd/root.go',
      'cmd/_service.go': `cmd/${this.props.servicePackage}.go`,
      '_.gitignore': '.gitignore',
      '_main.go': 'main.go',
      _Makefile: 'Makefile',
      '_README.md': 'README.md',
      '_config.toml': `${this.props.projectName}.toml`,
      'idl/_service.proto': `idl/${this.props.servicePackage}.proto`,
      'services/_server.go': `services/${this.props.servicePackage}/server.go`,
      'test/integration/_test.go': `test/integration/${
        this.props.servicePackage
      }_test.go`
    };
    const tplContext = {
      projectName: this.props.projectName,
      servicePackage: this.props.servicePackage,
      serviceName: this.props.serviceName,
      projectPath: this.projectPath
    };
    const keepFolders = [`plugins`, `grpc-gen/${this.props.servicePackage}`];

    for (let tpl in tplMap) {
      if (tplMap[tpl]) {
        this.fs.copyTpl(
          this.templatePath(tpl),
          this.destinationPath(`${this.props.projectName}/${tplMap[tpl]}`),
          tplContext
        );
      }
    }

    for (let k in keepFolders) {
      if (keepFolders[k]) {
        this.fs.copy(
          this.templatePath('_.gitkeep'),
          this.destinationPath(
            `${this.props.projectName}/${keepFolders[k]}/.gitkeep`
          )
        );
      }
    }
  }

  end() {
    if (this.stop) {
      return;
    }

    // Build end message content
    var filePath = this.templatePath('_end.txt');
    var content = this.fs.read(filePath);
    var result = ejs.compile(content)({
      projectName: this.props.projectName,
      servicePackage: this.props.servicePackage,
      chalk: chalk
    });
    this.log(result);
  }
};
