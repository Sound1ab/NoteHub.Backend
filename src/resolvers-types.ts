/* tslint:disable */

type Maybe<T> = T | null
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
}

export type CreateFileInput = {
  username: Scalars['String']
  repo: Scalars['String']
  filename: Scalars['String']
  content?: Maybe<Scalars['String']>
}

export type CreateRepoInput = {
  name: Scalars['String']
  description?: Maybe<Scalars['String']>
}

export type DeleteFileInput = {
  username: Scalars['String']
  repo: Scalars['String']
  filename: Scalars['String']
}

export type DeleteRepoInput = {
  username: Scalars['String']
  repo: Scalars['String']
}

export type File = {
  filename: Scalars['String']
  path: Scalars['String']
  content?: Maybe<Scalars['String']>
  excerpt?: Maybe<Scalars['String']>
  sha: Scalars['String']
  _links: Links
}

export type GithubUser = {
  id: Scalars['Int']
  login: Scalars['String']
  avatar_url: Scalars['String']
  html_url: Scalars['String']
  name: Scalars['String']
}

export type Links = {
  html: Scalars['String']
}

export type ModelFileConnection = {
  items: Array<File>
}

export type ModelRepoConnection = {
  items: Array<Repo>
}

export type Mutation = {
  createFile?: Maybe<File>
  updateFile?: Maybe<File>
  deleteFile?: Maybe<File>
  createImage?: Maybe<File>
  updateImage?: Maybe<File>
  deleteImage?: Maybe<File>
  createRepo?: Maybe<Repo>
  updateRepo?: Maybe<Repo>
  deleteRepo?: Maybe<Repo>
}

export type MutationCreateFileArgs = {
  input: CreateFileInput
}

export type MutationUpdateFileArgs = {
  input: UpdateFileInput
}

export type MutationDeleteFileArgs = {
  input: DeleteFileInput
}

export type MutationCreateImageArgs = {
  input: CreateFileInput
}

export type MutationUpdateImageArgs = {
  input: UpdateFileInput
}

export type MutationDeleteImageArgs = {
  input: DeleteFileInput
}

export type MutationCreateRepoArgs = {
  input: CreateRepoInput
}

export type MutationUpdateRepoArgs = {
  input: UpdateRepoInput
}

export type MutationDeleteRepoArgs = {
  input: DeleteRepoInput
}

export type Query = {
  readFile?: Maybe<File>
  listFiles: ModelFileConnection
  readImage?: Maybe<File>
  listImages: ModelFileConnection
  readRepo?: Maybe<Repo>
  listRepos: ModelRepoConnection
  readGithubUserAccessToken: Scalars['String']
  readGithubUser?: Maybe<GithubUser>
}

export type QueryReadFileArgs = {
  username: Scalars['String']
  repo: Scalars['String']
  filename: Scalars['String']
}

export type QueryListFilesArgs = {
  username: Scalars['String']
  repo: Scalars['String']
}

export type QueryReadImageArgs = {
  username: Scalars['String']
  repo: Scalars['String']
  filename: Scalars['String']
}

export type QueryListImagesArgs = {
  username: Scalars['String']
  repo: Scalars['String']
}

export type QueryReadRepoArgs = {
  username: Scalars['String']
  repo: Scalars['String']
}

export type QueryListReposArgs = {
  username: Scalars['String']
}

export type QueryReadGithubUserAccessTokenArgs = {
  code: Scalars['String']
  state: Scalars['String']
}

export type Repo = {
  id: Scalars['Int']
  node_id: Scalars['String']
  name: Scalars['String']
  full_name: Scalars['String']
  description?: Maybe<Scalars['String']>
}

export type UpdateFileInput = {
  username: Scalars['String']
  repo: Scalars['String']
  filename: Scalars['String']
  content?: Maybe<Scalars['String']>
}

export type UpdateRepoInput = {
  username: Scalars['String']
  repo: Scalars['String']
  name?: Maybe<Scalars['String']>
  description?: Maybe<Scalars['String']>
}

import { GraphQLResolveInfo } from 'graphql'

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult

export type StitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>
}

export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs>
  resolve?: SubscriptionResolveFn<TResult, TParent, TContext, TArgs>
}

export type SubscriptionResolver<
  TResult,
  TParent = {},
  TContext = {},
  TArgs = {}
> =
  | ((
      ...args: any[]
    ) => SubscriptionResolverObject<TResult, TParent, TContext, TArgs>)
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes>

export type NextResolverFn<T> = () => Promise<T>

export type DirectiveResolverFn<
  TResult = {},
  TParent = {},
  TContext = {},
  TArgs = {}
> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Query: Query
  String: Scalars['String']
  File: File
  Links: Links
  ModelFileConnection: ModelFileConnection
  Repo: Repo
  Int: Scalars['Int']
  ModelRepoConnection: ModelRepoConnection
  GithubUser: GithubUser
  Mutation: Mutation
  CreateFileInput: CreateFileInput
  UpdateFileInput: UpdateFileInput
  DeleteFileInput: DeleteFileInput
  CreateRepoInput: CreateRepoInput
  UpdateRepoInput: UpdateRepoInput
  DeleteRepoInput: DeleteRepoInput
  Boolean: Scalars['Boolean']
}

export type FileResolvers<
  Context = any,
  ParentType = ResolversTypes['File']
> = {
  filename?: Resolver<ResolversTypes['String'], ParentType, Context>
  path?: Resolver<ResolversTypes['String'], ParentType, Context>
  content?: Resolver<Maybe<ResolversTypes['String']>, ParentType, Context>
  excerpt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, Context>
  sha?: Resolver<ResolversTypes['String'], ParentType, Context>
  _links?: Resolver<ResolversTypes['Links'], ParentType, Context>
}

export type GithubUserResolvers<
  Context = any,
  ParentType = ResolversTypes['GithubUser']
> = {
  id?: Resolver<ResolversTypes['Int'], ParentType, Context>
  login?: Resolver<ResolversTypes['String'], ParentType, Context>
  avatar_url?: Resolver<ResolversTypes['String'], ParentType, Context>
  html_url?: Resolver<ResolversTypes['String'], ParentType, Context>
  name?: Resolver<ResolversTypes['String'], ParentType, Context>
}

export type LinksResolvers<
  Context = any,
  ParentType = ResolversTypes['Links']
> = {
  html?: Resolver<ResolversTypes['String'], ParentType, Context>
}

export type ModelFileConnectionResolvers<
  Context = any,
  ParentType = ResolversTypes['ModelFileConnection']
> = {
  items?: Resolver<Array<ResolversTypes['File']>, ParentType, Context>
}

export type ModelRepoConnectionResolvers<
  Context = any,
  ParentType = ResolversTypes['ModelRepoConnection']
> = {
  items?: Resolver<Array<ResolversTypes['Repo']>, ParentType, Context>
}

export type MutationResolvers<
  Context = any,
  ParentType = ResolversTypes['Mutation']
> = {
  createFile?: Resolver<
    Maybe<ResolversTypes['File']>,
    ParentType,
    Context,
    MutationCreateFileArgs
  >
  updateFile?: Resolver<
    Maybe<ResolversTypes['File']>,
    ParentType,
    Context,
    MutationUpdateFileArgs
  >
  deleteFile?: Resolver<
    Maybe<ResolversTypes['File']>,
    ParentType,
    Context,
    MutationDeleteFileArgs
  >
  createImage?: Resolver<
    Maybe<ResolversTypes['File']>,
    ParentType,
    Context,
    MutationCreateImageArgs
  >
  updateImage?: Resolver<
    Maybe<ResolversTypes['File']>,
    ParentType,
    Context,
    MutationUpdateImageArgs
  >
  deleteImage?: Resolver<
    Maybe<ResolversTypes['File']>,
    ParentType,
    Context,
    MutationDeleteImageArgs
  >
  createRepo?: Resolver<
    Maybe<ResolversTypes['Repo']>,
    ParentType,
    Context,
    MutationCreateRepoArgs
  >
  updateRepo?: Resolver<
    Maybe<ResolversTypes['Repo']>,
    ParentType,
    Context,
    MutationUpdateRepoArgs
  >
  deleteRepo?: Resolver<
    Maybe<ResolversTypes['Repo']>,
    ParentType,
    Context,
    MutationDeleteRepoArgs
  >
}

export type QueryResolvers<
  Context = any,
  ParentType = ResolversTypes['Query']
> = {
  readFile?: Resolver<
    Maybe<ResolversTypes['File']>,
    ParentType,
    Context,
    QueryReadFileArgs
  >
  listFiles?: Resolver<
    ResolversTypes['ModelFileConnection'],
    ParentType,
    Context,
    QueryListFilesArgs
  >
  readImage?: Resolver<
    Maybe<ResolversTypes['File']>,
    ParentType,
    Context,
    QueryReadImageArgs
  >
  listImages?: Resolver<
    ResolversTypes['ModelFileConnection'],
    ParentType,
    Context,
    QueryListImagesArgs
  >
  readRepo?: Resolver<
    Maybe<ResolversTypes['Repo']>,
    ParentType,
    Context,
    QueryReadRepoArgs
  >
  listRepos?: Resolver<
    ResolversTypes['ModelRepoConnection'],
    ParentType,
    Context,
    QueryListReposArgs
  >
  readGithubUserAccessToken?: Resolver<
    ResolversTypes['String'],
    ParentType,
    Context,
    QueryReadGithubUserAccessTokenArgs
  >
  readGithubUser?: Resolver<
    Maybe<ResolversTypes['GithubUser']>,
    ParentType,
    Context
  >
}

export type RepoResolvers<
  Context = any,
  ParentType = ResolversTypes['Repo']
> = {
  id?: Resolver<ResolversTypes['Int'], ParentType, Context>
  node_id?: Resolver<ResolversTypes['String'], ParentType, Context>
  name?: Resolver<ResolversTypes['String'], ParentType, Context>
  full_name?: Resolver<ResolversTypes['String'], ParentType, Context>
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, Context>
}

export type Resolvers<Context = any> = {
  File?: FileResolvers<Context>
  GithubUser?: GithubUserResolvers<Context>
  Links?: LinksResolvers<Context>
  ModelFileConnection?: ModelFileConnectionResolvers<Context>
  ModelRepoConnection?: ModelRepoConnectionResolvers<Context>
  Mutation?: MutationResolvers<Context>
  Query?: QueryResolvers<Context>
  Repo?: RepoResolvers<Context>
}

/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<Context = any> = Resolvers<Context>
