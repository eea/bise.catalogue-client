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
      coffee: [
        'src/Catalogue.coffee',
        'src/modules/Catalogue.Core.coffee',
        'src/modules/Catalogue.Search.coffee',
        'src/modules/Catalogue.Pagination.coffee',
        'src/modules/Catalogue.Init.coffee'
      ]
      stylus: [
        'src/stylesheets/catalogue.base.styl',
        'src/stylesheets/catalogue.layout.styl'
        'src/stylesheets/catalogue.cells.styl',
        'src/stylesheets/catalogue.pagination.styl'
      ]

    coffee:
      core: files: 'target/<%=meta.file%><%=meta.version%>/<%=meta.file%>.debug.js': '<%= source.coffee %>'

    uglify:
      options: compress: false, banner: "<%= meta.banner %>"
      engine: files: 'target/<%=meta.file%><%=meta.version%>/<%=meta.file%>.js': 'target/<%=meta.file%><%=meta.version%>/<%=meta.file%>.debug.js'

    stylus:
      core:
        options: compress: true, import: [ '__init']
        files: 'target/<%=meta.file%><%=meta.version%>/<%=meta.file%>.debug.css': '<%=source.stylus%>'

    watch:
      coffee:
        files: ['<%= source.coffee %>']
        tasks: ["coffee:core"]
      stylus:
        files: ['<%= source.stylus %>']
        tasks: ["stylus:core"]

  grunt.loadNpmTasks "grunt-contrib-coffee"
  grunt.loadNpmTasks "grunt-contrib-uglify"
  grunt.loadNpmTasks "grunt-contrib-stylus"
  grunt.loadNpmTasks "grunt-contrib-copy"
  grunt.loadNpmTasks "grunt-contrib-watch"

  grunt.registerTask "default", ["coffee", "uglify", "stylus"]
