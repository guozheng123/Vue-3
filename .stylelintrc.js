module.exports = {
    extends: [
        'stylelint-config-standard',
        'stylelint-config-prettier',
        'stylelint-config-recommended-less',
        'stylelint-config-standard-vue'
    ],
    // 不同格式的文件指定自定义语法
    overrides: [
        {
            files: ['**/*.(less|css|vue|html)'],
            customSyntax: 'postcss-less'
        },
        {
            files: ['**/*.(html|vue)'],
            customSyntax: 'postcss-html'
        }
    ],
    ignoreFiles: [
        '**/*.js',
        '**/*.jsx',
        '**/*.tsx',
        '**/*.ts',
        '**/*.json',
        '**/*.md',
        '**/*.yaml',
        '**/iconfont/*',
        '**/iconfont.*'
    ],
    rules: {
        'at-rule-no-unknown': null,
        'no-duplicate-selectors': null,
        'import-notation': null,
        'color-function-notation': null,
        'alpha-value-notation': null,
        'value-keyword-case': null,
        'string-quotes': 'single',
        'less/no-duplicate-variables': null,
        'selector-id-pattern': null,
        indentation: 4,
        'selector-class-pattern': null,
        'shorthand-property-no-redundant-values': null,
        'declaration-block-trailing-semicolon': null,
        'block-no-empty': null,
        'no-empty-source': null,
        'no-descending-specificity': null, // 禁止在具有较高优先级的选择器后出现被其覆盖的较低优先级的选择器
        'selector-pseudo-element-no-unknown': [
            true,
            {
                ignorePseudoElements: ['v-deep']
            }
        ],
        'at-rule-no-unknown': [
            true,
            {
                ignoreAtRules: ['plugin']
            }
        ],
        'rule-empty-line-before': [
            'always',
            {
                except: ['after-single-line-comment', 'first-nested']
            }
        ],

        'selector-pseudo-class-no-unknown': [
            true,
            {
                ignorePseudoClasses: ['deep', 'global']
            }
        ]
    }
};
