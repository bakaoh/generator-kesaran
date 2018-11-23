'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const ejs = require('ejs');

module.exports = class extends Generator {
  prompting() {
    // Have Yeoman greet the user.
    this.log(
      yosay(
        `Welcome to the wondrous ${chalk.red('generator-kesaran')} generator!`
      )
    );

    const prompts = [
      {
        type: 'input',
        name: 'projectName',
        message: 'Please type your project name',
        default: 'test'
      }
    ];

    return this.prompt(prompts).then(props => {
      this.props = props;
    });
  }

  writing() {
    const templates = [
      'cmd/_root.go',
      '_.gitignore',
      '_main.go',
      '_Makefile',
      '_README.md'
    ];
    for (let i in templates) {
      this.fs.copyTpl(
        this.templatePath(templates[i]),
        this.destinationPath(
          `${this.props.projectName}/${templates[i].replace('_', '')}`
        ),
        { projectName: this.props.projectName }
      );
    }

    this.fs.copy(
      this.templatePath('_config.toml'),
      this.destinationPath(
        `${this.props.projectName}/${this.props.projectName}.toml`
      )
    );
  }

  end() {
    // Build end message content
    var filePath = this.templatePath('_end.txt');
    var content = this.fs.read(filePath);
    var result = ejs.compile(content)({
      projectName: this.props.projectName,
      chalk: chalk
    });
    this.log(result);
  }
};
