module.exports = (grunt) ->

  grunt.initConfig

    meta:
      file: 'catalogue'
      packages: "packages",
      plugins: "src/plugins",
      version: "0.1",
      banner: '/*\n' +
              '   EEA Catalogue\n' +
              '   http://eea.europa.eu\n' +
              '   Copyright (c) EEA 2013 - developed by Jon Arrien\n' +
              '   Licensed MIT\n' +
              '*/\n'

    source:
      stylus: [
        'src/stylesheets/catalogue.base.styl',
        'src/stylesheets/catalogue.bootstrap.styl',
        'src/stylesheets/catalogue.layout.styl'
        'src/stylesheets/catalogue.cells.styl',
        'src/stylesheets/catalogue.pagination.styl'
      ]

    stylus:
      core:
        options: compress: true, import: [ '__init']
        files: 'src/catalogue.css': '<%=source.stylus%>'

    watch:
      stylus:
        files: ['<%= source.stylus %>']
        tasks: ["stylus:core"]

  grunt.loadNpmTasks "grunt-contrib-stylus"
  grunt.loadNpmTasks "grunt-contrib-copy"
  grunt.loadNpmTasks "grunt-contrib-watch"

  grunt.registerTask "default", ["stylus"]
