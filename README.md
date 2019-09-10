# Noted

This is a monorepo for the front and backend Noted app.

## Preview Links

App: [Master](http://noted-master.s3-website-eu-west-1.amazonaws.com/)

API: [Master](https://i3t2o6q09i.execute-api.eu-west-1.amazonaws.com/dev/graphql)

## Development

Docker-compose is used to run the project locally.

Development: `docker-compose up`

Force stop development: `docker-compose down`

## Docker

Stop machines: `docker stop $(docker ps -q)`

Remove images: `docker rmi $(docker ps -q)`

## Production

AWS [Lambda](https://aws.amazon.com/lambda/) and [APIGateway](https://aws.amazon.com/api-gateway/) are used with [serverless](https://serverless.com/) to host the API in production. 

## CircleCI

[Continuous integration](https://en.wikipedia.org/wiki/Continuous_integration) provided by [CircleCI](https://circleci.com/). As this is a monorepo, the config contains a diff step to determine which repo has been updated. Once it knows which repo is updated, it manually calls the CircleCI API to perform the build correct the build and deploy.

## GraphQL Code Generator

[GQL](https://github.com/dotansimha/graphql-code-generator) is used to provide TypeScript types for both the front and back end. Each repo has a `codegen.yml` to describe what and how the types are produced.

## Front End

Built with React and Hooks. Styled with Styled Components. Data layer provider by Apollo.

## Back End

Apollo Server Express used in development and Apollo Server Lambda used in production. GraphQL API wrapping Github's Octokit library.

To deploy the back end manually:

`npm run sls:deploy`

It can also be run offline:

`npm run sls:offline`

## Todo

Configure api CI on CircleCI. Need to set user permissions to access cloudformation.