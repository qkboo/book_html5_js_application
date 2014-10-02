module.exports = function(grunt) {
  // set up grunt
  grunt.initConfig({
    jshint: {
      src: ['Gruntfile.js', 'js/*.js', 'resources/*.js'],
      options: {
        curly: true,
        eqeqeq: true,
        undef: true,
        globals: {
	      jQuery: true
        }
      }
    },
	imagemin: {
		png: { // png 파일에 대한 정의
		  options: {
		    optimizationLevel: 7
		  },
		  files: [
		    {
		      // Set to true to enable the following options…
		      expand: true,
		      // cwd 는 이미지가 위치한 디렉토리를 지정
		      cwd: './images/',
		      src: ['**/*.png'],
		      // 변환한 이미지가 저장되는 위치
		      dest: './images/compressed/',
		      ext: '.png'
		    }
		  ]
		},
		jpg: { // jpg 파일에 대한 정의
		  options: {
		    progressive: true
		  },
		  files: [
		    {
		      expand: true,
		      cwd: './images/',
		      src: ['**/*.jpg'],
		      dest: './images/compressed/',
		      ext: '.jpg'
		    }
		  ]
		}
	}, //--> imagemin
	htmlmin: {
	    dist: {  // 결과 파일 설정
	      options: { 
	        removeComments: true,
	        collapseWhitespace: true
	      },
	      files: {  // 대상 소스 파일
	        'dist/index.html': 'index.html',
	        'dist/index2.html': 'index2.html'
	      }
	    }
  	}, // -> htmlmin
  	uglify: {
	    my_target: {
	      files: {
	        'dist/libraries.min.js': ['resources/jquery-2.1.0.js', 'resources/jquery.mobile-1.4.2.js']
	      }
	    }
  	}, 
    clean: {
      build: [
        'dist'
      ]
    },
    sshconfig: {
	  "beta-host": grunt.file.readJSON('../beta-host.json')
	},
	sshexec: {
	  test: {
	    command: 'uptime',
	    options: {
	      config: 'beta-host',
	      privateKey: grunt.file.read("~/.ssh/id_rsa"),
	      showProgress: true
	    }
	  },
	  ls: {
	    command: 'ls -la',
	    options: {
	      config: 'beta-host',
	      privateKey: grunt.file.read("~/.ssh/id_rsa"),
	      showProgress: true
	    }
	  }
	},
    shell : {// scp build/ to a remote host
    	publish: {
        	command : 'scp -r dist 192.168.219.180:~/bookhtml5/'
    	}
    }

  });//<-- grunt.initConfig()

  // Load JSHint task
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-ssh');
  grunt.loadNpmTasks('grunt-shell');

  // Default task.
  grunt.registerTask('imgminall', ['imagemin']);
  grunt.registerTask('imgminpng', ['imagemin:png']);
  grunt.registerTask('imgminjpg', ['imagemin:jpg']);
  grunt.registerTask('myhtmlmin', ['htmlmin']);
  grunt.registerTask('myuglify', ['uglify']);
  grunt.registerTask('allclean', ['clean']);
  grunt.registerTask('beta-test', ['sshexec:test', 'sshexec:ls']);
  grunt.registerTask('publish', ['clean', 'htmlmin', 'imgminall', 'myuglify', 'shell:publish']);
  grunt.registerTask('default', ['jshint']);

};
