module.exports = {
    presets: [
        ["@babel/preset-env", {
            targets: {
                chrome: '50'
            },
            "useBuiltIns": "usage"
        }]
    ],
    plugins: [
        ["@babel/plugin-transform-runtime", {
            // "corejs": false,
            "helpers": true,
            "regenerator": true,
            "useESModules": false
        }],
        ["@babel/plugin-proposal-decorators", { "legacy": true }],
        ["@babel/plugin-proposal-class-properties"],
        ["@babel/plugin-syntax-dynamic-import"],
        ["@babel/plugin-transform-modules-commonjs"],
        [
            "react-css-modules",
            {
                "generateScopedName": "[name]_[local]",
                "filetypes": {
                    ".scss": {
                        "syntax": "postcss-scss"
                    }
                },
                "handleMissingStyleName": "ignore"
            }
        ],
    ],
}




// module.exports = {
//     presets: ['@babel/preset-env', '@babel/preset-react'],
//     plugins: ['@babel/plugin-transform-runtime', '@babel/plugin-proposal-class-properties', '@babel/plugin-syntax-dynamic-import'],
// }