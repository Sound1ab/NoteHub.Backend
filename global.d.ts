declare module 'http'
declare module '@octokit/plugin-throttling'

declare module '*.graphql' {
  const value: any
  export default value
}
