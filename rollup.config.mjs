// 核心，用于打包
import { defineConfig } from 'rollup'
// 可选，用于解析代码中的外部依赖，添加该插件后默认会将所有依赖打包进 build.js 中
import resolve from '@rollup/plugin-node-resolve'
// 可选，外部依赖的导出大部分是 commonjs 格式，需要先进过该插件的处理
import commonjs from '@rollup/plugin-commonjs'
// 可选，让 rollup 无缝衔接 babel
import babel from '@rollup/plugin-babel'
// 可选，压缩代码
import terser from '@rollup/plugin-terser'
import { nodeResolve } from '@rollup/plugin-node-resolve'

// 使用 defineConfig 是为了获得类型提示，直接导出一个对象也是可以的
export default defineConfig({
    input: 'src/index.ts',
    plugins: [
        // 导入模块时，经常会省略扩展名，该插件就是用来自动判断扩展名的
        nodeResolve({ extensions: ['.ts'] }),
        // ⚠️ extensions 默认不包含 ts，所以需要提供 .ts
        babel({ babelHelpers: 'bundled', extensions: ['.ts'] }),
        commonjs(),
        resolve(),
    ],
    output: [
        {
            file: 'dist/build.js',
            format: 'cjs',
        },
        {
            file: 'dist/build.min.js',
            format: 'cjs',
            plugins: [terser()], // 打包后再处理的插件要放在这里
        },
    ],
})
