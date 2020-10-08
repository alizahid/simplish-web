export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: any;
};

export type Query = {
  __typename?: 'Query';
  boards: Array<Board>;
  board: Board;
  items: Array<Item>;
  lists: Array<List>;
  profile: User;
};


export type QueryBoardArgs = {
  boardId: Scalars['Int'];
};


export type QueryItemsArgs = {
  listId: Scalars['Int'];
};

export type Board = {
  __typename?: 'Board';
  id: Scalars['Int'];
  name: Scalars['String'];
  lists?: Maybe<Array<List>>;
  createdAt: Scalars['DateTime'];
};

export type List = {
  __typename?: 'List';
  id: Scalars['Int'];
  name: Scalars['String'];
  items?: Maybe<Array<Item>>;
  createdAt: Scalars['DateTime'];
};

export type Item = {
  __typename?: 'Item';
  id: Scalars['Int'];
  body: Scalars['String'];
  complete: Scalars['Boolean'];
  description?: Maybe<Scalars['String']>;
  date?: Maybe<Scalars['DateTime']>;
  assignees?: Maybe<Array<User>>;
  comments?: Maybe<Array<Comment>>;
  user?: Maybe<User>;
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
};


export type User = {
  __typename?: 'User';
  id: Scalars['Int'];
  name: Scalars['String'];
  email: Scalars['String'];
};

export type Comment = {
  __typename?: 'Comment';
  id: Scalars['Int'];
  body: Scalars['String'];
  user: User;
  createdAt: Scalars['DateTime'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createBoard: Board;
  updateBoard: Board;
  deleteBoard: Scalars['Boolean'];
  reorderBoard: Scalars['Boolean'];
  createItem: Item;
  updateItem: Item;
  deleteItem: Scalars['Boolean'];
  toggleItem: Scalars['Boolean'];
  moveItem: Scalars['Boolean'];
  createList: List;
  updateList: List;
  deleteList: Scalars['Boolean'];
  reorderList: Scalars['Boolean'];
  signIn: AuthResult;
  updatePushToken: Scalars['Boolean'];
  reorderLists: Scalars['Boolean'];
};


export type MutationCreateBoardArgs = {
  name: Scalars['String'];
};


export type MutationUpdateBoardArgs = {
  name: Scalars['String'];
  boardId: Scalars['Int'];
};


export type MutationDeleteBoardArgs = {
  boardId: Scalars['Int'];
};


export type MutationReorderBoardArgs = {
  order: Array<Scalars['Int']>;
  boardId: Scalars['Int'];
};


export type MutationCreateItemArgs = {
  data: ItemInput;
  listId: Scalars['Int'];
};


export type MutationUpdateItemArgs = {
  data: ItemInput;
  itemId: Scalars['Int'];
};


export type MutationDeleteItemArgs = {
  itemId: Scalars['Int'];
};


export type MutationToggleItemArgs = {
  complete: Scalars['Boolean'];
  itemId: Scalars['Int'];
};


export type MutationMoveItemArgs = {
  toOrder: Array<Scalars['Int']>;
  fromOrder: Array<Scalars['Int']>;
  toListId: Scalars['Int'];
  fromListId: Scalars['Int'];
  itemId: Scalars['Int'];
};


export type MutationCreateListArgs = {
  boardId?: Maybe<Scalars['Int']>;
  name: Scalars['String'];
};


export type MutationUpdateListArgs = {
  name: Scalars['String'];
  listId: Scalars['Int'];
};


export type MutationDeleteListArgs = {
  listId: Scalars['Int'];
};


export type MutationReorderListArgs = {
  order: Array<Scalars['Int']>;
  listId: Scalars['Int'];
};


export type MutationSignInArgs = {
  token: Scalars['String'];
};


export type MutationUpdatePushTokenArgs = {
  token: Scalars['String'];
};


export type MutationReorderListsArgs = {
  order: Array<Scalars['Int']>;
};

export type ItemInput = {
  body: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  date?: Maybe<Scalars['String']>;
};

export type AuthResult = {
  __typename?: 'AuthResult';
  token: Scalars['String'];
  user: User;
};
