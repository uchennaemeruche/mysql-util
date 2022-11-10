module.exports ={
    branches:['master'],
    plugins: [
        '@semantic-release/commit-analyzer',
        '@semantic-release/release-notes-generator',
        [
          '@semantic-release/changelog',
          {
            changelogFile: 'CHANGELOG.md'
          }
        ],
        [
            '@semantic-release/npm',
            {
                "pkgRoot": "lib"
            }
        ],
        '@semantic-release/github',
        '@semantic-release/git',
      ]
}