/* tslint:disable */
export type Maybe<T> = T | null
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
}

export type CreateFileInput = {
  path: Scalars['String']
  content?: Maybe<Scalars['String']>
}

export type DeleteFileInput = {
  path: Scalars['String']
}

export type File = {
  __typename?: 'File'
  filename: Scalars['String']
  path: Scalars['String']
  content?: Maybe<Scalars['String']>
  excerpt?: Maybe<Scalars['String']>
  sha: Scalars['String']
  type: Node_Type
  url: Scalars['String']
}

export type GithubUser = {
  __typename?: 'GithubUser'
  id: Scalars['Int']
  login: Scalars['String']
  avatar_url: Scalars['String']
  html_url: Scalars['String']
  name: Scalars['String']
}

export type GitNode = {
  __typename?: 'GitNode'
  path: Scalars['String']
  type: Node_Type
  sha: Scalars['String']
  url: Scalars['String']
}

export type Links = {
  __typename?: 'Links'
  html: Scalars['String']
}

export type ModelFileConnection = {
  __typename?: 'ModelFileConnection'
  items: Array<File>
}

export type ModelNodeConnection = {
  __typename?: 'ModelNodeConnection'
  nodes: Array<GitNode>
}

export type ModelRepoConnection = {
  __typename?: 'ModelRepoConnection'
  items: Array<Repo>
}

export type MoveFileInput = {
  path: Scalars['String']
  newPath: Scalars['String']
}

export type Mutation = {
  __typename?: 'Mutation'
  createFile?: Maybe<File>
  updateFile?: Maybe<File>
  deleteFile?: Maybe<File>
  moveFile?: Maybe<File>
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

export type MutationMoveFileArgs = {
  input: MoveFileInput
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

export type MutationUpdateRepoArgs = {
  input: UpdateRepoInput
}

export enum Node_Type {
  File = 'FILE',
  Folder = 'FOLDER',
}

export type Query = {
  __typename?: 'Query'
  login: Scalars['String']
  logout: Scalars['String']
  refresh?: Maybe<Scalars['String']>
  readFile?: Maybe<File>
  readNodes: ModelNodeConnection
  readImage?: Maybe<File>
  readRepo?: Maybe<Repo>
  readGithubUserAccessToken: Scalars['String']
  readGithubUser?: Maybe<GithubUser>
}

export type QueryReadFileArgs = {
  path: Scalars['String']
}

export type QueryReadImageArgs = {
  path: Scalars['String']
}

export type QueryReadGithubUserAccessTokenArgs = {
  code: Scalars['String']
  state: Scalars['String']
}

export type Repo = {
  __typename?: 'Repo'
  id: Scalars['Int']
  node_id: Scalars['String']
  name: Scalars['String']
  full_name: Scalars['String']
  description?: Maybe<Scalars['String']>
  private: Scalars['Boolean']
}

export type UpdateFileInput = {
  path: Scalars['String']
  content?: Maybe<Scalars['String']>
}

export type UpdateRepoInput = {
  description?: Maybe<Scalars['String']>
  private?: Maybe<Scalars['Boolean']>
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
  NODE_TYPE: Node_Type
  ModelNodeConnection: ModelNodeConnection
  GitNode: GitNode
  Repo: Repo
  Int: Scalars['Int']
  Boolean: Scalars['Boolean']
  GithubUser: GithubUser
  Mutation: Mutation
  CreateFileInput: CreateFileInput
  UpdateFileInput: UpdateFileInput
  DeleteFileInput: DeleteFileInput
  MoveFileInput: MoveFileInput
  UpdateRepoInput: UpdateRepoInput
  Links: Links
  ModelFileConnection: ModelFileConnection
  ModelRepoConnection: ModelRepoConnection
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
  type?: Resolver<ResolversTypes['NODE_TYPE'], ParentType, Context>
  url?: Resolver<ResolversTypes['String'], ParentType, Context>
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

export type GitNodeResolvers<
  Context = any,
  ParentType = ResolversTypes['GitNode']
> = {
  path?: Resolver<ResolversTypes['String'], ParentType, Context>
  type?: Resolver<ResolversTypes['NODE_TYPE'], ParentType, Context>
  sha?: Resolver<ResolversTypes['String'], ParentType, Context>
  url?: Resolver<ResolversTypes['String'], ParentType, Context>
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

export type ModelNodeConnectionResolvers<
  Context = any,
  ParentType = ResolversTypes['ModelNodeConnection']
> = {
  nodes?: Resolver<Array<ResolversTypes['GitNode']>, ParentType, Context>
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
  moveFile?: Resolver<
    Maybe<ResolversTypes['File']>,
    ParentType,
    Context,
    MutationMoveFileArgs
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
  createRepo?: Resolver<Maybe<ResolversTypes['Repo']>, ParentType, Context>
  updateRepo?: Resolver<
    Maybe<ResolversTypes['Repo']>,
    ParentType,
    Context,
    MutationUpdateRepoArgs
  >
  deleteRepo?: Resolver<Maybe<ResolversTypes['Repo']>, ParentType, Context>
}

export type QueryResolvers<
  Context = any,
  ParentType = ResolversTypes['Query']
> = {
  login?: Resolver<ResolversTypes['String'], ParentType, Context>
  logout?: Resolver<ResolversTypes['String'], ParentType, Context>
  refresh?: Resolver<Maybe<ResolversTypes['String']>, ParentType, Context>
  readFile?: Resolver<
    Maybe<ResolversTypes['File']>,
    ParentType,
    Context,
    QueryReadFileArgs
  >
  readNodes?: Resolver<
    ResolversTypes['ModelNodeConnection'],
    ParentType,
    Context
  >
  readImage?: Resolver<
    Maybe<ResolversTypes['File']>,
    ParentType,
    Context,
    QueryReadImageArgs
  >
  readRepo?: Resolver<Maybe<ResolversTypes['Repo']>, ParentType, Context>
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
  private?: Resolver<ResolversTypes['Boolean'], ParentType, Context>
}

export type Resolvers<Context = any> = {
  File?: FileResolvers<Context>
  GithubUser?: GithubUserResolvers<Context>
  GitNode?: GitNodeResolvers<Context>
  Links?: LinksResolvers<Context>
  ModelFileConnection?: ModelFileConnectionResolvers<Context>
  ModelNodeConnection?: ModelNodeConnectionResolvers<Context>
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
