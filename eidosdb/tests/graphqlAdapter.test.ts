import { graphql } from "graphql";
import { createSchema } from "../src/api/graphqlAdapter";
import { EidosStore } from "../src/storage/symbolicStore";
import { MemoryStore } from "../src/storage/memoryStore";

// Teste básico do adaptador GraphQL para garantir inserção e consulta
describe("GraphQL adapter", () => {
  it("inserts and queries ideas", async () => {
    const store = new EidosStore(new MemoryStore());
    const { schema, root } = createSchema(store);
    const idea = {
      id: "1",
      label: "teste",
      vector: [0.1],
      w: 0.2,
      r: 0.3,
      context: "ctx",
      userId: "u1",
    };
    await graphql({
      schema,
      rootValue: root,
      source: `mutation($idea: SemanticIdeaInput!){\n        insertIdea(input:$idea)\n      }`,
      variableValues: { idea },
    });
    const result = await graphql({
      schema,
      rootValue: root,
      source: `{ ideas(w:0.2, userId:"u1"){ id label } }`,
    });
    expect(result.data?.ideas[0].id).toBe("1");
  });
});
