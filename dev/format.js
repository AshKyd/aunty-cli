const map = require('map-stream');
const prettier = require('prettier');
const vfs = require('vinyl-fs');

const CONFIG = {
  printWidth: 80,
  tabWidth: 2,
  singleQuote: true,
  trailingComma: false,
  bracketSpacing: false
};

const formatter = map((file, cb) => {
  file.contents = new Buffer(
    prettier.format(
      file.contents.toString(),
      CONFIG
    ),
    'utf8'
  );

  cb(null, file);
});

vfs
.src(['bin/*.js', 'lib/*.js'], {base: './'})
.pipe(formatter)
.pipe(vfs.dest('.'));
