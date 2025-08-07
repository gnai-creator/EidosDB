import { buildSchema, GraphQLScalarType, Kind, type ValueNode } from "graphql";
import { createHandler } from "graphql-http/lib/use/express";
import { ruruHTML } from "ruru/server";
import type { Express } from "express";
import type { EidosStore } from "../storage/symbolicStore";
import type { SemanticIdea } from "../core/symbolicTypes";

// Função auxiliar para converter AST em valores JavaScript
function parseLiteral(ast: ValueNode): any {
  switch (ast.kind) {
    case Kind.STRING:
    case Kind.BOOLEAN:
      return ast.value;
    case Kind.INT:
    case Kind.FLOAT:
      return parseFloat(ast.value);
    case Kind.OBJECT: {
      const value: Record<string, any> = {};
      for (const field of ast.fields) {
        value[field.name.value] = parseLiteral(field.value);
      }
      return value;
    }
    case Kind.LIST:
      return ast.values.map((v) => parseLiteral(v));
    default:
      return null;
  }
}

// Escalar personalizado para trabalhar com valores JSON
const JSONScalar = new GraphQLScalarType({
  name: "JSON",
  description: "Representa valores JSON arbitrários",
  serialize: (value) => value,
  parseValue: (value) => value,
  parseLiteral,
});

/**
 * Cria schema GraphQL e resolvers usando a memória simbólica fornecida.
 */
export function createSchema(store: EidosStore) {
  const schema = buildSchema(`
    scalar JSON

    type SemanticIdea {
      id: String!
      label: String!
      vector: [Float!]!
      w: Float!
      r: Float!
      userId: String!
      context: String!
      timestamp: Float
      ttl: Float
      metadata: JSON
      tags: [String]
      v: Float
    }

    input SemanticIdeaInput {
      id: String!
      label: String!
      vector: [Float!]!
      w: Float!
      r: Float!
      userId: String!
      context: String!
      timestamp: Float
      ttl: Float
      metadata: JSON
      tags: [String]
    }

    type Query {
      ideas(w: Float!, c: Float, userId: String!, context: String, tags: [String], metadata: JSON): [SemanticIdea!]!
      dump(userId: String!): [SemanticIdea!]!
    }

    type Mutation {
      insertIdea(input: SemanticIdeaInput!): Boolean
      tick: Boolean
      reinforce(id: String!, userId: String!, factor: Float): Boolean
      restore(userId: String!, snapshot: [SemanticIdeaInput!]!): Boolean
      save: Boolean
      load: Boolean
    }
  `);

  const root = {
    JSON: JSONScalar,
    ideas: async ({ w, c, userId, context, tags, metadata }: any) => {
      return store.query(w, { userId, context, tags, metadata }, c);
    },
    dump: async ({ userId }: { userId: string }) => store.snapshot(userId),
    insertIdea: async ({ input }: { input: SemanticIdea }) => {
      await store.insert(input);
      return true;
    },
    tick: async () => {
      await store.tick();
      return true;
    },
    reinforce: async ({ id, userId, factor }: { id: string; userId: string; factor?: number }) => {
      await store.reinforce(userId, id, factor);
      return true;
    },
    restore: async ({ userId, snapshot }: { userId: string; snapshot: SemanticIdea[] }) => {
      await store.restore(snapshot, userId);
      return true;
    },
    save: async () => {
      await store.save();
      return true;
    },
    load: async () => {
      await store.load();
      return true;
    },
  };

  return { schema, root };
}

/**
 * Anexa o endpoint /graphql ao aplicativo Express.
 */
export function setupGraphQL(app: Express, store: EidosStore) {
  const { schema, root } = createSchema(store);
  app.use("/graphql", createHandler({ schema, rootValue: root }));
  app.get("/graphiql", (_req, res) => {
    res.type("html");
    res.end(ruruHTML({ endpoint: "/graphql" }));
  });
}
