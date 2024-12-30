// подключите плагины в файл
const autoprefixer = require('autoprefixer'); // добавляет префиксы для кроссбраузерности 
const cssnano = require('cssnano'); // минифицирует файлы css (делает в одну строку без отступов чтобы было легче читать браузеру)

module.exports = {
  // подключите плагины к PostCSS
  plugins: [
    // подключите autoprefixer
    autoprefixer,
    // cssnano при подключении нужно передать объект опций
    // { preset: default } говорит о том, что нужно использовать
    // стандартные настройки минификации
    cssnano({ preset: 'default' })
  ]
}; 