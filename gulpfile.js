// html
const html_src = [
	'app/template/header.html',
	'app/header/*.html',
	'app/about/*.html',
	'app/brands/*.html',
	'app/features/*.html',
	'app/cooperation/*.html',
	'app/strategy/*.html',
	'app/footer/*.html',
	'app/template/footer.html',
]

// sass
const sass_src = [
	//_preset
	'app/template/_preset.sass',
	'app/**/_preset.sass',
	//_fonts
	'app/template/_fonts.sass',
	// *
	'app/template/*.sass',
	'app/**/*.sass',
]

// js
const js_src = ['app/**/*.js']

//images
const images_src = [
	'app/**/*.jpg',
	'app/**/*.svg',
	'app/**/*.png',
	'app/**/*.webp',
	'app/**/*.ico',
]

// json
const json_src = ['app/**/*.json']

// files
const files_src = ['app/**/*.doc']
const fonts_src = [
	'app/template/fonts/**/*.eot',
	'app/template/fonts/**/*.ttf',
	'app/template/fonts/**/*.woff',
	'app/template/fonts/**/*.woff2',
]

//
// подключение модулей
//
const { src, dest, series, watch } = require('gulp') // галп
const sass = require('gulp-sass')(require('sass'))
const csso = require('gulp-csso')
const html_min = require('gulp-htmlmin')
const auto_prefixer = require('gulp-autoprefixer')
const concat = require('gulp-concat')
const uglify = require('gulp-uglify-es').default
const image_min = require('gulp-imagemin')
const del = require('del')

//
// основное тело галпа
//

// del src
const del_src = () => {
	return del('dist/')
}

// html build
const build_html_min = () => {
	return src(html_src)
		.pipe(concat('index.html'))
		.pipe(
			html_min({
				collapseWhitespace: true,
				removeComments: true,
				removeTagWhitespace: true,
				ignoreCustomFragments: [/<svg.*\/svg>/],
			})
		)
		.pipe(dest('dist/min/'))
}
const build_html = () => {
	return src(html_src)
		.pipe(concat('index.html'))
		.pipe(dest('dist/full/'))
}

// css build
const build_css_min = () => {
	return src(sass_src)
		.pipe(concat('style.sass'))
		.pipe(
			sass({
				indentedSyntax: false,
			})
		)
		.pipe(
			auto_prefixer({
				overrideBrowserslist: 'last 2 versions',
			})
		)
		.pipe(concat('style.css'))
		.pipe(csso())
		.pipe(dest('dist/min/'))
}
const build_css = () => {
	return src(sass_src)
		.pipe(concat('style.sass'))
		.pipe(
			sass({
				indentedSyntax: false,
			})
		)
		.pipe(
			auto_prefixer({
				overrideBrowserslist: 'last 2 versions',
			})
		)
		.pipe(concat('style.css'))
		.pipe(dest('dist/full/'))
}

// js build
const build_js_min = () => {
	return src(js_src)
		.pipe(concat('script.js'))
		.pipe(uglify())
		.pipe(dest('dist/min/'))
}
const build_js = () => {
	return src(js_src)
		.pipe(concat('script.js'))
		.pipe(dest('dist/full/'))
}

// images build
const build_images_min = () => {
	return src(images_src)
		.pipe(
			image_min([
				image_min.gifsicle({ interlaced: true }),
				image_min.mozjpeg({
					quality: 75,
					progressive: true,
				}),
				image_min.optipng({
					optimizationLevel: 5,
				}),
				image_min.svgo({
					plugins: [{ removeViewBox: true }, { cleanupIDs: false }],
				}),
			])
		)
		.pipe(dest('dist/min/images/'))
}
const build_images = () => {
	return src(images_src).pipe(dest('dist/full/images/'))
}

// files export
const build_json_min = () => {
	return src(json_src).pipe(dest('dist/min/json/'))
}
const build_json = () => {
	return src(json_src).pipe(dest('dist/full/json/'))
}
const build_files_min = () => {
	return src(files_src).pipe(dest('dist/min/files/'))
}
const build_files = () => {
	return src(files_src).pipe(dest('dist/full/files/'))
}
const build_fonts_min = () => {
	return src(fonts_src).pipe(dest('dist/min/fonts/'))
}
const build_fonts = () => {
	return src(fonts_src).pipe(dest('dist/full/fonts/'))
}

//
// to watch
//
const toWatch = () => {
	watch(html_src, series(build_html_min, build_html))
	watch(sass_src, series(build_css_min, build_css))
	watch(js_src, series(build_js_min, build_js))

	watch(images_src, series(build_images_min, build_images))
	watch(json_src, series(build_json_min, build_json))
	watch(files_src, series(build_files_min, build_files))
}

//
// объявление функции для консоли
//
exports.default = series(
	del_src,

	build_html_min,
	build_html,

	build_css_min,
	build_css,

	build_js_min,
	build_js,

	build_images_min,
	build_images,

	build_json_min,
	build_json,

	build_files_min,
	build_files,

	build_fonts_min,
	build_fonts,

	toWatch
)
